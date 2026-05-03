import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { Product } from '../../services/product';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { WishlistService } from '../../services/wishlist.service';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../empty-state/empty-state';
export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
  addedAt: number;
}

/**
 * Wishlist Component
 * Manages user's wishlist via WishlistService
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
  wishlistItems: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wishlistService.wishlistItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.wishlistItems = items;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  /**
   * Get wishlist count
   */
  getWishlistCount(): number {
    return this.wishlistService.getWishlistCount();
  }

  /**
   * Add wishlist item to cart
   */
  addToCartFromWishlist(item: any): void {
    const product: Product = {
      id: item.productId || item.id,
      title: item.productTitle || item.title,
      price: item.price,
      description: '',
      image: item.productImage || item.image,
      imageUrl: item.productImage || item.image,
      rating: 0,
      stock: 100, // Default stock
      category: '',
      categoryName: '',
      categoryId: 0
    };

    this.cartService.addToCart(product, 1).subscribe({
      next: (success) => {
        if (success) {
          // Toast handled by CartService
        }
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
        this.notificationService.showError('Failed to add item to cart');
      }
    });
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

