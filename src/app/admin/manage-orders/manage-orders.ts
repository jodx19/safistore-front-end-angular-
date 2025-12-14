import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";

interface Order {
  id: string;
  customer: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  date: string;
}

@Component({
  selector: "app-manage-orders",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./manage-orders.html",
  styleUrls: ["./manage-orders.css"],
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [
    {
      id: "ORD-001",
      customer: "John Doe",
      total: 234.5,
      status: "delivered",
      date: "2025-11-01",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      total: 567.8,
      status: "shipped",
      date: "2025-11-02",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      total: 123.45,
      status: "pending",
      date: "2025-11-05",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      total: 345.0,
      status: "confirmed",
      date: "2025-11-05",
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/products"]);
    }
  }

  // ✅ Fixed: تحويل event إلى HTMLSelectElement
  updateStatus(order: Order, event: Event) {
    const selectElement = event.target as HTMLSelectElement; // ✅ Cast to HTMLSelectElement
    const newStatus = selectElement.value;
    order.status = newStatus as any;
    this.notificationService.showSuccess("Order status updated to: " + newStatus);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  }
}
