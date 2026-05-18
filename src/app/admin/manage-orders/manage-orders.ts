import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { OrderClient, OrderDto, ApiResponse, PaginatedResult } from "../../api-client/api-client";
import { Subject, takeUntil } from "rxjs";
import { AdminLayoutComponent } from "../admin-layout/admin-layout";

@Component({
  selector: "app-manage-orders",
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: "./manage-orders.html",
  styleUrls: ["./manage-orders.css"],
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  orders: OrderDto[] = [];
  filteredOrders: OrderDto[] = [];
  loading = false;
  error = "";

  // Filters
  searchQuery = "";
  statusFilter = "all";
  dateFrom = "";
  dateTo = "";

  private destroy$ = new Subject<void>();

  get pendingOrders(): OrderDto[] {
    return this.orders.filter(o => o.status?.toLowerCase() === 'pending');
  }

  get confirmedOrders(): OrderDto[] {
    return this.orders.filter(o => o.status?.toLowerCase() === 'confirmed');
  }

  get shippedOrders(): OrderDto[] {
    return this.orders.filter(o => o.status?.toLowerCase() === 'shipped');
  }

  get deliveredOrders(): OrderDto[] {
    return this.orders.filter(o => o.status?.toLowerCase() === 'delivered');
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private orderClient: OrderClient
  ) { }

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/products"]);
      return;
    }
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders() {
    this.loading = true;
    this.orderClient.getAllOrders(1, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: ApiResponse<any>) => {
          const payload = resp.data;
          this.orders = payload?.orders ?? payload?.products ?? [];
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.error = "Failed to load orders";
          this.loading = false;
        }
      });
  }

  updateStatus(order: OrderDto, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    this.orderClient.updateStatus(order.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          order.status = newStatus;
          this.notificationService.showSuccess(`Order ${order.id} status updated to: ${newStatus}`);
        },
        error: () => {
          this.notificationService.showError("Failed to update order status");
        }
      });
  }

  onSearchInput(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = "";
    this.statusFilter = "all";
    this.dateFrom = "";
    this.dateTo = "";
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toString().includes(q) ||
        `${o.userId}`.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter !== "all") {
      filtered = filtered.filter(o =>
        o.status?.toLowerCase() === this.statusFilter
      );
    }

    if (this.dateFrom) {
      const from = new Date(this.dateFrom);
      filtered = filtered.filter(o => o.createdAt && new Date(o.createdAt) >= from);
    }

    if (this.dateTo) {
      const to = new Date(this.dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(o => o.createdAt && new Date(o.createdAt) <= to);
    }

    this.filteredOrders = filtered;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "#F59E0B";
      case "confirmed":
        return "#3B82F6";
      case "shipped":
        return "#22D3EE";
      case "delivered":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6C4FF6";
    }
  }
}
