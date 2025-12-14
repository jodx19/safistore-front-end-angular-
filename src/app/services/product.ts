// (Updated for .NET Backend)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, retry, shareReplay, tap, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiHelper } from '../utils/api-helper';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  rating: number;
  categoryId?: number;
  imageUrl?: string;
  categoryName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Use .NET backend API
  private apiUrl = ApiHelper.getEndpoint('products');

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private productsCache$?: Observable<any>;
  private productsCacheTime?: number;

  constructor(private http: HttpClient) {}

  /**
   * Get all products from .NET backend
   * Supports pagination, filtering, and sorting
   *
   * EXAMPLE:
   * this.productService.getAllProducts({
   *   page: 1,
   *   limit: 20,
   *   category: 'Electronics',
   *   search: 'laptop'
   * })
   */
  getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Observable<any> {
    // Build query parameters
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('pageSize', params.limit.toString());
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.search) httpParams = httpParams.set('search', params.search);

    // Check cache (only for default requests without params)
    if (!params && this.productsCache$ && this.isCacheValid(this.productsCacheTime)) {
      return this.productsCache$;
    }

    // Fetch from .NET backend
    const request$ = this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      timeout(environment.timeouts.apiRequest),
      retry(1),
      tap((response) => {
        // Cache only default requests
        if (!params) {
          this.productsCacheTime = Date.now();
        }
      }),
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );

    if (!params) {
      this.productsCache$ = request$;
    }

    return request$;
  }

  /**
   * Get product by ID from .NET backend
   */
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      timeout(environment.timeouts.apiRequest),
      retry(1),
      catchError((error) => {
        console.error(`Error fetching product ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new product (Admin only)
   */
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      timeout(environment.timeouts.apiRequest),
      tap(() => this.clearCache()),
      catchError((error) => {
        console.error('Error creating product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update product (Admin only)
   */
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product).pipe(
      timeout(environment.timeouts.apiRequest),
      tap(() => this.clearCache()),
      catchError((error) => {
        console.error(`Error updating product ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete product (Admin only)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(environment.timeouts.apiRequest),
      tap(() => this.clearCache()),
      catchError((error) => {
        console.error(`Error deleting product ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get categories from .NET backend
   */
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
      timeout(environment.timeouts.apiRequest),
      retry(1),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }

  private isCacheValid(cacheTime?: number): boolean {
    if (!cacheTime) return false;
    return Date.now() - cacheTime < this.CACHE_DURATION;
  }

  clearCache(): void {
    this.productsCache$ = undefined;
    this.productsCacheTime = undefined;
  }
}
