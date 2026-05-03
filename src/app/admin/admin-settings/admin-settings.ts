import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.css']
})
export class AdminSettingsComponent {
  activeTab = 'general';
  tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'shipping', label: 'Shipping', icon: '🚚' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'team', label: 'Team', icon: '👥' }
  ];

  // General
  general = {
    storeName: 'SafiStore',
    storeEmail: 'contact@safistore.com',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    taxRate: 10
  };

  // Shipping zones
  shippingZones = [
    { id: 1, name: 'Domestic (US)', rate: 0, minOrder: 100, days: '5-7' },
    { id: 2, name: 'Express (US)', rate: 9.99, minOrder: 0, days: '2-3' },
    { id: 3, name: 'Overnight (US)', rate: 24.99, minOrder: 0, days: '1' },
    { id: 4, name: 'International', rate: 19.99, minOrder: 0, days: '10-14' }
  ];

  // Payment gateways
  paymentGateways = [
    { id: 'stripe', name: 'Stripe', description: 'Credit/Debit Cards', icon: '💳', enabled: true },
    { id: 'paypal', name: 'PayPal', description: 'PayPal Wallet', icon: '🅿️', enabled: true },
    { id: 'apple', name: 'Apple Pay', description: 'Touch ID / Face ID', icon: '🍎', enabled: false },
    { id: 'google', name: 'Google Pay', description: 'Google Wallet', icon: '🔵', enabled: false }
  ];

  // Notifications
  notifications = {
    newOrder: true,
    orderShipped: true,
    lowStock: true,
    newCustomer: false,
    abandonedCart: true,
    reviewPosted: false,
    refundRequest: true,
    weeklyReport: true
  };

  // Team
  teamMembers = [
    { name: 'John Admin', email: 'john@safistore.com', role: 'Super Admin', avatar: 'JA', joinDate: '2024-01-01' },
    { name: 'Sarah Manager', email: 'sarah@safistore.com', role: 'Manager', avatar: 'SM', joinDate: '2024-03-15' }
  ];
  inviteEmail = '';
  inviteRole = 'Manager';

  isSaving = false;

  constructor(private notificationService: NotificationService) {}

  saveGeneral(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.notificationService.showSuccess('✅ Settings saved successfully!');
    }, 800);
  }

  sendInvite(): void {
    if (!this.inviteEmail.includes('@')) {
      this.notificationService.showError('❌ Please enter a valid email');
      return;
    }
    this.notificationService.showSuccess(`✅ Invitation sent to ${this.inviteEmail}`);
    this.inviteEmail = '';
  }
}
