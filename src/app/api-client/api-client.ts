
/**
 * API Client for SafiiStore backend.
 *
 * ⚠️ IMPORTANT – GENERATED FILE
 * This file is a hand-crafted placeholder that mirrors the structure of
 * the NSwag-generated client. Once you run:
 *
 *   npm run nswag:generate
 *
 * the real generated file will replace this one in src/app/api-client/.
 * DO NOT add business logic here – keep it as a thin HTTP wrapper.
 *
 * Base URL: https://localhost:7203/api/v1
 */

import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// ---------------------------------------------------------------------------
// Shared API Response wrapper (matches backend envelope)
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  errors?: any;
}

// ---------------------------------------------------------------------------
// Auth DTOs
// ---------------------------------------------------------------------------

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  user: UserDto;
  errors: string[];
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
  createdAt: string;
}

export interface RefreshTokenRequestDto {
  accessToken: string;
  refreshToken: string;
}

// ---------------------------------------------------------------------------
// Product DTOs
// ---------------------------------------------------------------------------

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Cart DTOs
// ---------------------------------------------------------------------------

export interface CartDto {
  id: number;
  userId: string;
  items: CartItemDto[];
  totalPrice: number;
  createdAt?: string;
}

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// ---------------------------------------------------------------------------
// Order DTOs  (aligned with backend CreateOrderDto / OrderDto)
// ---------------------------------------------------------------------------

export interface OrderDto {
  id: number;
  userId: number | string;          // backend sends int, kept flexible
  shippingAddress: string;
  city: string;
  country: string;
  postalCode: string;
  status: string;
  createdAt?: string;
  totalAmount?: number;
  total?: number;                   // alias from backend
  totalPrice?: number;              // legacy alias for frontend templates
  items?: OrderItemDto[];
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
  /** Display fields – populated when backend returns full order */
  productName?: string;
  unitPrice?: number;
  totalPrice?: number;
}

/** Sent to POST /api/v1/Orders */
export interface CreateOrderDto {
  shippingAddress: string;
  city: string;
  country: string;
  postalCode: string;
  paymentMethod?: string;
}

/** @deprecated - use CreateOrderDto */
export interface CheckoutDto {
  shippingAddress: string;
}

// ---------------------------------------------------------------------------
// Review DTOs
// ---------------------------------------------------------------------------

export interface ReviewDto {
  id: number;
  userId: number;
  productId: number;
  productName?: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface AddReviewDto {
  productId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export interface ReviewSummaryDto {
  productId: number;
  averageRating: number;
  totalReviews: number;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginatedResult<T> {
  products: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ---------------------------------------------------------------------------
// Base API Client
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class ApiClientBase {
  protected baseUrl: string;

  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  protected getJson<T>(path: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams });
  }

  protected postJson<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  protected putJson<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  protected patchJson<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  protected deleteJson<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }

  protected postFormData<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, formData);
  }
}

// ---------------------------------------------------------------------------
// Auth Client
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class AuthClient extends ApiClientBase {
  constructor(http: HttpClient) { super(http); }

  register(dto: RegisterRequestDto): Observable<AuthResponseDto> {
    return this.postJson<AuthResponseDto>('/auth/register', dto);
  }

  login(dto: LoginRequestDto): Observable<AuthResponseDto> {
    return this.postJson<AuthResponseDto>('/auth/login', dto);
  }

  refreshToken(dto: RefreshTokenRequestDto): Observable<AuthResponseDto> {
    return this.postJson<AuthResponseDto>('/auth/refresh', dto);
  }

  logout(): Observable<ApiResponse<null>> {
    return this.postJson<ApiResponse<null>>('/auth/logout', {});
  }

  forgotPassword(email: string): Observable<ApiResponse<null>> {
    return this.postJson<ApiResponse<null>>('/auth/forgot-password', { email });
  }

  resetPassword(dto: { email: string; token: string; newPassword: string }): Observable<ApiResponse<null>> {
    return this.postJson<ApiResponse<null>>('/auth/reset-password', dto);
  }

  changePassword(dto: { currentPassword: string; newPassword: string }): Observable<ApiResponse<null>> {
    return this.postJson<ApiResponse<null>>('/auth/change-password', dto);
  }

  updateProfile(dto: any): Observable<ApiResponse<UserDto>> {
    return this.putJson<ApiResponse<UserDto>>('/auth/profile', dto);
  }
}

// ---------------------------------------------------------------------------
// Product Client
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class ProductClient extends ApiClientBase {
  constructor(http: HttpClient) { super(http); }

  getAll(page = 1, pageSize = 10, search?: string, category?: string): Observable<ApiResponse<PaginatedResult<ProductDto>>> {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (category) params.category = category;
    return this.getJson<ApiResponse<PaginatedResult<ProductDto>>>('/products', params);
  }

  getById(id: number): Observable<ApiResponse<ProductDto>> {
    return this.getJson<ApiResponse<ProductDto>>(`/products/${id}`);
  }

  create(dto: CreateProductDto): Observable<ApiResponse<ProductDto>> {
    return this.postJson<ApiResponse<ProductDto>>('/products', dto);
  }

  update(id: number, dto: UpdateProductDto): Observable<ApiResponse<ProductDto>> {
    return this.putJson<ApiResponse<ProductDto>>(`/products/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.deleteJson<ApiResponse<null>>(`/products/${id}`);
  }

  uploadImage(id: number, file: File): Observable<ApiResponse<ProductDto>> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.postFormData<ApiResponse<ProductDto>>(`/products/${id}/image`, form);
  }
}

// ---------------------------------------------------------------------------
// Cart Client
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class CartClient extends ApiClientBase {
  constructor(http: HttpClient) { super(http); }

  getCart(): Observable<ApiResponse<CartDto>> {
    return this.getJson<ApiResponse<CartDto>>('/cart');
  }

  addItem(dto: AddToCartDto): Observable<ApiResponse<CartDto>> {
    return this.postJson<ApiResponse<CartDto>>('/cart/items', dto);
  }

  updateItem(itemId: number, dto: UpdateCartItemDto): Observable<ApiResponse<CartDto>> {
    return this.putJson<ApiResponse<CartDto>>(`/cart/items/${itemId}`, dto);
  }

  removeItem(itemId: number): Observable<ApiResponse<null>> {
    return this.deleteJson<ApiResponse<null>>(`/cart/items/${itemId}`);
  }

  clearCart(): Observable<ApiResponse<null>> {
    return this.deleteJson<ApiResponse<null>>('/cart');
  }
}

// ---------------------------------------------------------------------------
// Order Client
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class OrderClient extends ApiClientBase {
  constructor(http: HttpClient) { super(http); }

  getMyOrders(): Observable<ApiResponse<OrderDto[]>> {
    return this.getJson<ApiResponse<OrderDto[]>>('/orders');
  }

  getById(id: number): Observable<ApiResponse<OrderDto>> {
    return this.getJson<ApiResponse<OrderDto>>(`/orders/${id}`);
  }

  checkout(dto: CreateOrderDto): Observable<ApiResponse<{ data: number }>> {
    // Backend returns ApiResponse<int> (the new order ID)
    return this.postJson<ApiResponse<{ data: number }>>('/orders', dto);
  }

  /** Admin: list all orders via GET /api/v1/Admin/orders */
  getAllOrders(page = 1, pageSize = 50): Observable<ApiResponse<any>> {
    return this.getJson<ApiResponse<any>>('/admin/orders', { page, pageSize });
  }

  /** Admin: update order status via PUT /api/v1/Admin/orders/{id}/status */
  updateStatus(orderId: number, status: string): Observable<ApiResponse<OrderDto>> {
    return this.putJson<ApiResponse<OrderDto>>(`/admin/orders/${orderId}/status`, { status });
  }

  /** Admin: cancel order via POST /api/v1/Admin/orders/{id}/cancel */
  cancelOrder(orderId: number): Observable<ApiResponse<OrderDto>> {
    return this.postJson<ApiResponse<OrderDto>>(`/admin/orders/${orderId}/cancel`, {});
  }
}

// ---------------------------------------------------------------------------
// Review Client
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class ReviewClient extends ApiClientBase {
  constructor(http: HttpClient) { super(http); }

  getProductSummary(productId: number): Observable<ApiResponse<ReviewSummaryDto>> {
    return this.getJson<ApiResponse<ReviewSummaryDto>>(`/reviews/product/${productId}/summary`);
  }

  getByProduct(productId: number): Observable<ApiResponse<ReviewDto[]>> {
    return this.getJson<ApiResponse<ReviewDto[]>>(`/reviews/product/${productId}`);
  }

  getMyReviews(): Observable<ApiResponse<ReviewDto[]>> {
    return this.getJson<ApiResponse<ReviewDto[]>>('/reviews/my-reviews');
  }

  getAll(): Observable<ApiResponse<ReviewDto[]>> {
    return this.getJson<ApiResponse<ReviewDto[]>>('/reviews');
  }

  add(dto: AddReviewDto): Observable<ApiResponse<ReviewDto>> {
    return this.postJson<ApiResponse<ReviewDto>>('/reviews', dto);
  }

  update(id: number, dto: UpdateReviewDto): Observable<ApiResponse<ReviewDto>> {
    return this.putJson<ApiResponse<ReviewDto>>(`/reviews/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.deleteJson<ApiResponse<null>>(`/reviews/${id}`);
  }
}
