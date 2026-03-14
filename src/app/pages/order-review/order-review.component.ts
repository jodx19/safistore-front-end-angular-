import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { OrderReviewService } from './order-review.service';

/**
 * Order Review Component
 * Displays order summary before final confirmation
 */
@Component({
  selector: 'app-order-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.css']
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal = { subtotal: 0, tax: 0, shipping: 10, total: 0 };
  loading = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private orderReviewService: OrderReviewService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupBreadcrumbs();
    this.loadCartData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup breadcrumb navigation
   */
  private setupBreadcrumbs(): void {
    this.breadcrumbItems = [
      { label: 'Home', route: '/' },
      { label: 'Cart', route: '/cart' },
      { label: 'Review Order' }
    ];
  }

  /**
   * Load cart data
   */
  private loadCartData(): void {
    this.orderReviewService.getOrderReview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orderReview) => {
          this.cartItems = orderReview.items;
          this.cartTotal = orderReview.totals;

          if (orderReview.isEmpty) {
            this.notificationService.showWarning('Your cart is empty. Redirecting to products...');
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 2000);
          }
        }
      });
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  /**
   * Confirm and place order
   */
  confirmOrder(): void {
    if (this.cartItems.length === 0) {
      this.notificationService.showError('Cannot place order with empty cart');
      return;
    }

    const user = this.getCurrentUser();
    if (!user) {
      this.notificationService.showError('Please log in to place an order');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    // Prepare order data
    const orderData = this.orderReviewService.buildCreateOrderRequest(user, this.cartItems);

    // Create order
    this.orderService.createOrder(orderData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.loading = false;
          this.cartService.clearCart();
          this.notificationService.showSuccess(`Order placed successfully! Order #${order.id}`);
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          this.notificationService.showError('Failed to place order. Please try again.');
        }
      });
  }

  /**
   * Go back to checkout
   */
  goBack(): void {
    this.router.navigate(['/checkout']);
  }

  /**
   * Navigate to products page
   */
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}

