import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { OrderClient, OrderDto } from "../../api-client/api-client";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-manage-orders",
  standalone: true,
  imports: [CommonModule],
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
        next: (resp) => {
          this.orders = resp.data.items;
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
        return "bg-gray-100 text-gray-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
