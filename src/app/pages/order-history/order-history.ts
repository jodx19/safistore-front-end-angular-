import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

/**
 * Order History Component
 * Displays user's order history
 */
@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  breadcrumbItems: BreadcrumbItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupBreadcrumbs();
    this.loadOrders();
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
      { label: 'Order History' }
    ];
  }

  /**
   * Load user's orders
   */
  private loadOrders(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.loading = false;
      this.notificationService.showError('Please log in to view your orders');
      this.router.navigate(['/login']);
      return;
    }

    const customerId = user.id?.toString() || user.email;
    this.orderService.getMyOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to load orders');
          this.loading = false;
        }
      });
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * View order details
   */
  viewOrder(orderId?: number): void {
    if (orderId) {
      this.router.navigate(['/track'], { queryParams: { orderId } });
    }
  }

  /**
   * Format date
   */
  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Navigate to products page
   */
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}

