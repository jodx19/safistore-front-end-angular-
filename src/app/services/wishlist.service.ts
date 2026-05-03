import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private STORAGE_KEY = 'safi_wishlist';
  
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItems.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Load wishlist on initialization
    this.loadWishlistFromStorage();
  }

  /**
   * Load wishlist from Local Storage
   */
  private loadWishlistFromStorage(): void {
    try {
      this.isLoading.next(true);
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.wishlistItems.next(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse wishlist from local storage', e);
      this.wishlistItems.next([]);
    } finally {
      this.isLoading.next(false);
    }
  }

  /**
   * Save wishlist to Local Storage
   */
  private saveWishlistToStorage(items: WishlistItem[]): void {
    this.wishlistItems.next(items);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(product: any): Observable<boolean> {
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

    const newItem: WishlistItem = {
      id: Date.now(),
      productId: productId,
      productTitle: product?.title || product?.name || 'Product',
      productImage: product?.imageUrl || product?.image || '',
      price: product?.price || 0,
      addedAt: new Date().toISOString()
    };

    const currentItems = this.wishlistItems.value;
    this.saveWishlistToStorage([...currentItems, newItem]);
    
    this.notificationService.showSuccess(`✅ ${newItem.productTitle} added to wishlist`);
    return of(true);
  }

  /**
   * Remove item from wishlist
   */
  removeFromWishlist(wishlistItemIdOrProductId: number): void {
    const currentItems = this.wishlistItems.value;
    const newItems = currentItems.filter(item => 
      item.id !== wishlistItemIdOrProductId && item.productId !== wishlistItemIdOrProductId
    );
    
    if (currentItems.length !== newItems.length) {
      this.saveWishlistToStorage(newItems);
      this.notificationService.showSuccess('✅ Item removed from wishlist');
    }
  }

  /**
   * Clear entire wishlist
   */
  clearWishlist(): void {
    this.saveWishlistToStorage([]);
    this.notificationService.showSuccess('✅ Wishlist cleared');
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
      this.removeFromWishlist(productId);
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
