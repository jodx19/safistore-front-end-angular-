import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface Customer {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'banned';
  avatar: string;
}

@Component({
  selector: 'app-manage-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent],
  templateUrl: './manage-customers.html',
  styleUrls: ['./manage-customers.css']
})
export class ManageCustomersComponent {
  searchQuery = '';
  selectedCustomer: Customer | null = null;

  customers: Customer[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2024-01-15', orders: 12, totalSpent: 2340.50, status: 'active', avatar: 'AJ' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com', joinDate: '2024-02-20', orders: 8, totalSpent: 1560.00, status: 'active', avatar: 'BW' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', joinDate: '2024-03-05', orders: 3, totalSpent: 450.75, status: 'active', avatar: 'CD' },
    { id: 4, name: 'David Martinez', email: 'david@example.com', joinDate: '2024-01-28', orders: 22, totalSpent: 5890.00, status: 'active', avatar: 'DM' },
    { id: 5, name: 'Eva Thompson', email: 'eva@example.com', joinDate: '2023-12-10', orders: 0, totalSpent: 0, status: 'banned', avatar: 'ET' },
    { id: 6, name: 'Frank Lee', email: 'frank@example.com', joinDate: '2024-04-01', orders: 5, totalSpent: 890.25, status: 'active', avatar: 'FL' },
    { id: 7, name: 'Grace Kim', email: 'grace@example.com', joinDate: '2024-02-14', orders: 18, totalSpent: 3200.00, status: 'active', avatar: 'GK' },
    { id: 8, name: 'Henry Brown', email: 'henry@example.com', joinDate: '2023-11-30', orders: 7, totalSpent: 1120.50, status: 'active', avatar: 'HB' },
  ];

  get filteredCustomers(): Customer[] {
    if (!this.searchQuery.trim()) return this.customers;
    const q = this.searchQuery.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }

  openProfile(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  closeProfile(): void {
    this.selectedCustomer = null;
  }

  toggleBan(customer: Customer): void {
    customer.status = customer.status === 'active' ? 'banned' : 'active';
    if (this.selectedCustomer?.id === customer.id) {
      this.selectedCustomer = { ...customer };
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  get totalRevenue(): number {
    return this.customers.reduce((s, c) => s + c.totalSpent, 0);
  }

  get activeCount(): number {
    return this.customers.filter(c => c.status === 'active').length;
  }
}
