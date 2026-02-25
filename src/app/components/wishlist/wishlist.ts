import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { Product } from '../../services/product';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../empty-state/empty-state';

/**
 * Wishlist Item interface
 */
export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
  addedAt: number;
}

/**
 * Wishlist Component
 * Manages user's wishlist with localStorage persistence
 * Storage key: wishlist_<userId>
 */
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  @Input() compact = false; // Compact mode for header dropdown
  wishlistItems: WishlistItem[] = [];
  loading = false;
  private readonly STORAGE_KEY_PREFIX = 'wishlist_';
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to auth changes to load user-specific wishlist
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.loadWishlist();
        } else {
          this.wishlistItems = [];
          this.wishlistSubject.next([]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get storage key for current user's wishlist
   */
  private getStorageKey(): string {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 'guest';
    return `${this.STORAGE_KEY_PREFIX}${userId}`;
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlist(): void {
    try {
      const storageKey = this.getStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        this.wishlistItems = [];
        this.wishlistSubject.next([]);
        return;
      }

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        this.wishlistItems = [];
        this.wishlistSubject.next([]);
        return;
      }

      this.wishlistItems = parsed;
      this.wishlistSubject.next(this.wishlistItems);
    } catch {
      // Storage unavailable or parsing error
      this.wishlistItems = [];
      this.wishlistSubject.next([]);
    }
  }

  /**
   * Save wishlist to localStorage
   */
  private saveWishlist(): void {
    try {
      const storageKey = this.getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(this.wishlistItems));
      this.wishlistSubject.next(this.wishlistItems);
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(product: Product): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('Please log in to add items to wishlist');
      this.router.navigate(['/login']);
      return;
    }

    const existingIndex = this.wishlistItems.findIndex(item => item.id === product.id);
    if (existingIndex !== -1) {
      this.notificationService.showInfo('Product already in wishlist');
      return;
    }

    const wishlistItem: WishlistItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      addedAt: Date.now()
    };

    this.wishlistItems.push(wishlistItem);
    this.saveWishlist();
    this.notificationService.showSuccess('Added to wishlist');
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.saveWishlist();
    this.notificationService.showSuccess('Removed from wishlist');
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  /**
   * Get wishlist count
   */
  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  /**
   * Add wishlist item to cart
   */
  addToCartFromWishlist(item: WishlistItem): void {
    const product: Product = {
      id: item.id,
      title: item.title,
      price: item.price,
      description: '',
      image: item.image,
      rating: 0,
      stock: 100, // Default stock
      category: ''
    };

    const success = this.cartService.addToCart(product);
    if (success) {
      this.notificationService.showSuccess(`${item.title} added to cart!`);
    }
  }

  /**
   * Navigate to product detail
   */
  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  /**
   * Navigate to products page
   */
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}

