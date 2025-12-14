import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalOrders: 124,
    totalRevenue: 45230,
    totalProducts: 45,
    pendingOrders: 8
  };

  recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', total: 234.50, status: 'Delivered' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 567.80, status: 'Pending' },
    { id: 'ORD-003', customer: 'Mike Johnson', total: 123.45, status: 'In Transit' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is admin
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/products']);
    }
  }
}