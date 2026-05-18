import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout';
import { OrderClient, ProductClient } from '../../api-client/api-client';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminLayoutComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  recentOrders: any[] = [];

  stats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderClient: OrderClient,
    private productClient: ProductClient
  ) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/products']);
      return;
    }
    this.loadData();
  }

  private loadData() {
    // Load orders
    this.orderClient.getAllOrders(1, 100).subscribe({
      next: (resp: any) => {
        const orders = resp?.data?.orders || [];
        this.stats.totalOrders = orders.length;
        this.stats.totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        this.stats.pendingOrders = orders.filter((o: any) => o.status?.toLowerCase() === 'pending').length;

        this.recentOrders = orders.slice(0, 5).map((o: any) => ({
          id: `ORD-${String(o.id).padStart(6, '0')}`,
          customer: `User #${o.userId}`,
          total: o.totalAmount || 0,
          status: o.status || 'Pending'
        }));
      }
    });

    // Load products count
    this.productClient.getAll(1, 1).subscribe({
      next: (resp: any) => {
        this.stats.totalProducts = resp?.data?.pagination?.total || 0;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'shipped': 
      case 'in transit': return '#22D3EE';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6C4FF6';
    }
  }
}