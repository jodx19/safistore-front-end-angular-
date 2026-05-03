import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export interface WishlistItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  price: number;
  addedAt: string;
}

interface WishlistResponse {
  items: WishlistItem[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItems.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Load wishlist when user logs in
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadWishlistFromBackend();
      } else {
        // Clear wishlist when user logs out
        this.wishlistItems.next([]);
      }
    });
  }

  /**
   * Load wishlist from backend API
   */
  private loadWishlistFromBackend(): void {
    if (!this.authService.isAuthenticated()) {
      this.wishlistItems.next([]);
      return;
    }

    this.isLoading.next(true);
    this.http.get<{ success: boolean; data: WishlistResponse }>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Failed to load wishlist:', error);
          this.notificationService.showError('⚠️ Failed to load wishlist. Please refresh the page.');
          return of({ success: false, data: { items: [] } });
        })
      )
      .subscribe((response) => {
        if (response?.success && response.data?.items) {
          this.wishlistItems.next(response.data.items);
        } else {
          this.wishlistItems.next([]);
        }
        this.isLoading.next(false);
      });
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(product: any): Observable<boolean> {
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showWarning('🔐 Please log in to add items to wishlist.');
      return of(false);
    }

    const productId = Number(product?.id);
    if (!productId || productId <= 0) {
      this.notificationService.showError('❌ Invalid product.');
      return of(false);
    }

    // Check if already in wishlist
    if (this.isInWishlist(productId)) {
      this.notificationService.showInfo('ℹ️ Product already in wishlist');
      return of(true);
    }

    this.isLoading.next(true);

    const payload = {
      productId: productId
    };

    return this.http.post<{ success: boolean; data: WishlistItem }>(
      `${this.apiUrl}/items`,
      payload
    ).pipe(
      tap((response) => {
        if (response?.success && response.data) {
          this.loadWishlistFromBackend();
          this.notificationService.showSuccess(
            `✅ ${product?.title || product?.name || 'Product'} added to wishlist`
          );
        }
        this.isLoading.next(false);
      }),
      map((response) => response?.success ?? false),
      catchError((error) => {
        console.error('Failed to add to wishlist:', error);
        const message = error?.error?.message || error?.error?.error?.message || 'Failed to add item to wishlist';
        this.notificationService.showError(`❌ ${message}`);
        this.isLoading.next(false);
        return of(false);
      })
    );
  }

  /**
   * Remove item from wishlist
   */
  removeFromWishlist(wishlistItemId: number): void {
    this.isLoading.next(true);
    
    this.http.delete<{ success: boolean }>(`${this.apiUrl}/items/${wishlistItemId}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to remove item:', error);
          this.notificationService.showError('❌ Failed to remove item from wishlist.');
          this.isLoading.next(false);
          return of({ success: false });
        })
      )
      .subscribe((response) => {
        if (response?.success) {
          this.loadWishlistFromBackend();
          this.notificationService.showSuccess('✅ Item removed from wishlist');
        }
        this.isLoading.next(false);
      });
  }

  /**
   * Clear entire wishlist
   */
  clearWishlist(): void {
    this.isLoading.next(true);
    
    this.http.delete<{ success: boolean }>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Failed to clear wishlist:', error);
          this.notificationService.showError('❌ Failed to clear wishlist.');
          this.isLoading.next(false);
          return of({ success: false });
        })
      )
      .subscribe((response) => {
        if (response?.success) {
          this.wishlistItems.next([]);
          this.notificationService.showSuccess('✅ Wishlist cleared');
        }
        this.isLoading.next(false);
      });
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.value.some(item => item.productId === productId);
  }

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  toggleWishlist(product: any): Observable<boolean> {
    const productId = Number(product?.id);
    if (this.isInWishlist(productId)) {
      const item = this.wishlistItems.value.find(item => item.productId === productId);
      if (item) {
        this.removeFromWishlist(item.id);
      }
      return of(true);
    } else {
      return this.addToWishlist(product);
    }
  }

  /**
   * Get wishlist items
   */
  getWishlistItems(): WishlistItem[] {
    return this.wishlistItems.value;
  }

  /**
   * Get wishlist count
   */
  getWishlistCount(): number {
    return this.wishlistItems.value.length;
  }
}
