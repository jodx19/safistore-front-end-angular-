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
      'pending': 'bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]',
      'processing': 'bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6]',
      'shipped': 'bg-[#6C4FF6]/15 border border-[#6C4FF6]/30 text-[#6C4FF6]',
      'delivered': 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]',
      'cancelled': 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
    };
    return statusMap[status] || 'bg-slate-500/15 border border-slate-500/30 text-slate-400';
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

