import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { OrderClient, OrderDto, ApiResponse, PaginatedResult } from "../../api-client/api-client";
import { Subject, takeUntil } from "rxjs";
import { AdminLayoutComponent } from "../admin-layout/admin-layout";

@Component({
  selector: "app-manage-orders",
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  templateUrl: "./manage-orders.html",
  styleUrls: ["./manage-orders.css"],
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  orders: OrderDto[] = [];
  loading = false;
  error = "";
  private destroy$ = new Subject<void>();

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
