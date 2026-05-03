import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AdminLayoutComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  kpis = [
    { label: 'Total Revenue',    value: '$124,590', change: '12.5%', up: true,  icon: '💰', bgColor: 'rgba(108,79,246,0.15)' },
    { label: 'Total Orders',     value: '1,847',    change: '8.2%',  up: true,  icon: '📦', bgColor: 'rgba(59,130,246,0.15)'  },
    { label: 'Active Customers', value: '3,241',    change: '15.3%', up: true,  icon: '👥', bgColor: 'rgba(16,185,129,0.15)'  },
    { label: 'Conversion Rate',  value: '3.24%',    change: '0.8%',  up: false, icon: '📊', bgColor: 'rgba(245,158,11,0.15)'  }
  ];

  revenueChart = [
    { month: 'Jun', value: 8400,  current: false },
    { month: 'Jul', value: 11200, current: false },
    { month: 'Aug', value: 9800,  current: false },
    { month: 'Sep', value: 13500, current: false },
    { month: 'Oct', value: 15200, current: false },
    { month: 'Nov', value: 19800, current: false },
    { month: 'Dec', value: 24600, current: false },
    { month: 'Jan', value: 18200, current: false },
    { month: 'Feb', value: 14400, current: false },
    { month: 'Mar', value: 17800, current: false },
    { month: 'Apr', value: 21000, current: false },
    { month: 'May', value: 24590, current: true  }
  ];

  get maxRevenue(): number {
    return Math.max(...this.revenueChart.map(d => d.value));
  }

  orderStatus = [
    { label: 'Pending',    count: 142, color: '#F59E0B' },
    { label: 'Processing', count: 289, color: '#3B82F6' },
    { label: 'Shipped',    count: 456, color: '#6C4FF6' },
    { label: 'Delivered',  count: 892, color: '#10B981' },
    { label: 'Cancelled',  count: 68,  color: '#EF4444' }
  ];

  topProducts = [
    { name: 'ProBook X1 Laptop',       sales: 124, revenue: 45200, stock: 12 },
    { name: 'SoundMax Pro Headphones', sales: 312, revenue: 28400, stock: 3  },
    { name: 'SmartWatch Ultra',        sales: 189, revenue: 22100, stock: 8  },
    { name: 'Gaming Controller Pro',   sales: 445, revenue: 18600, stock: 2  },
    { name: 'Pixel 9 Pro',             sales: 67,  revenue: 16800, stock: 15 }
  ];

  recentOrders = [
    { id: 'SAF-2025-78421', customer: 'John Doe',       total: 234.50, status: 'Delivered'  },
    { id: 'SAF-2025-78420', customer: 'Jane Smith',     total: 567.80, status: 'Pending'    },
    { id: 'SAF-2025-78419', customer: 'Mike Johnson',   total: 123.45, status: 'In Transit' },
    { id: 'SAF-2025-78418', customer: 'Sarah Williams', total: 890.00, status: 'Delivered'  },
    { id: 'SAF-2025-78417', customer: 'Tom Brown',      total: 45.99,  status: 'Pending'    }
  ];

  lowStockItems = [
    { name: 'SoundMax Pro Headphones', stock: 3 },
    { name: 'Gaming Controller Pro',   stock: 2 },
    { name: 'SmartWatch Ultra',        stock: 4 },
    { name: 'USB-C Hub Pro',           stock: 1 }
  ];

  stats = {
    totalOrders: 1847,
    totalRevenue: 124590,
    totalProducts: 3241,
    pendingOrders: 142
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/products']);
    }
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