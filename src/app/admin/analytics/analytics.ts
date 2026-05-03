import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminLayoutComponent],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {
  selectedRange = '30d';
  ranges = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' }
  ];

  // Revenue chart data (mock — last 12 months)
  revenueData = [
    { month: 'Jun', value: 8400, orders: 120 },
    { month: 'Jul', value: 11200, orders: 158 },
    { month: 'Aug', value: 9800, orders: 134 },
    { month: 'Sep', value: 13500, orders: 192 },
    { month: 'Oct', value: 15200, orders: 210 },
    { month: 'Nov', value: 19800, orders: 278 },
    { month: 'Dec', value: 24600, orders: 345 },
    { month: 'Jan', value: 18200, orders: 252 },
    { month: 'Feb', value: 14400, orders: 198 },
    { month: 'Mar', value: 17800, orders: 240 },
    { month: 'Apr', value: 21000, orders: 290 },
    { month: 'May', value: 24590, orders: 334 }
  ];

  get maxRevenue(): number {
    return Math.max(...this.revenueData.map(d => d.value));
  }

  getBarHeight(value: number): number {
    return (value / this.maxRevenue) * 100;
  }

  topProducts = [
    { name: 'ProBook X1 Laptop', category: 'Computers', revenue: 45200, units: 124, change: +12.5 },
    { name: 'SoundMax Pro Headphones', category: 'Audio', revenue: 28400, units: 312, change: +8.2 },
    { name: 'SmartWatch Ultra', category: 'Wearables', revenue: 22100, units: 189, change: -2.1 },
    { name: 'Gaming Controller Pro', category: 'Gaming', revenue: 18600, units: 445, change: +15.3 },
    { name: 'Pixel 9 Pro', category: 'Phones', revenue: 16800, units: 67, change: +5.7 }
  ];

  categoryData = [
    { name: 'Computers', value: 35, color: '#6C4FF6' },
    { name: 'Audio', value: 22, color: '#3B82F6' },
    { name: 'Wearables', value: 18, color: '#22D3EE' },
    { name: 'Gaming', value: 14, color: '#10B981' },
    { name: 'Phones', value: 11, color: '#F59E0B' }
  ];

  geoData = [
    { country: '🇺🇸 United States', orders: 4521, revenue: 89420 },
    { country: '🇬🇧 United Kingdom', orders: 2134, revenue: 42300 },
    { country: '🇩🇪 Germany', orders: 1876, revenue: 38100 },
    { country: '🇫🇷 France', orders: 1432, revenue: 28600 },
    { country: '🇨🇦 Canada', orders: 1123, revenue: 22400 },
    { country: '🇦🇺 Australia', orders: 987, revenue: 19600 },
  ];

  kpis = [
    { label: 'Total Revenue', value: '$124,590', change: '+12.5%', up: true, icon: '💰' },
    { label: 'Total Orders', value: '1,847', change: '+8.2%', up: true, icon: '📦' },
    { label: 'New Customers', value: '3,241', change: '+15.3%', up: true, icon: '👥' },
    { label: 'Avg Order Value', value: '$67.40', change: '-0.8%', up: false, icon: '📊' }
  ];

  ngOnInit(): void {}
}
