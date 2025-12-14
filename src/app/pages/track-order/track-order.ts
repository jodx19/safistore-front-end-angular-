
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackingService, TrackingStatus } from '../../services/tracking.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-order.html',
  styleUrls: ['./track-order.css']
})
export class TrackOrderComponent {
  orderNumber = '';
  tracking: TrackingStatus | null = null;
  loading = false;
  error = '';

  statuses = ['pending', 'confirmed', 'shipped', 'in-transit', 'delivered'];

  constructor(private trackingService: TrackingService) {}

  trackOrder() {
    if (!this.orderNumber.trim()) {
      this.error = 'Please enter order number';
      return;
    }

    this.loading = true;
    this.error = '';

    this.trackingService.trackOrder(this.orderNumber).subscribe(
      (data) => {
        this.loading = false;
        this.tracking = data;
      },
      (err) => {
        this.loading = false;
        this.error = 'Order not found';
      }
    );
  }

  getStatusColor(status: string): string {
    return this.trackingService.getStatusColor(status);
  }

  getStatusIcon(status: string): string {
    return this.trackingService.getStatusIcon(status);
  }

  isStatusActive(status: string): boolean {
    if (!this.tracking) return false;
    const currentIndex = this.statuses.indexOf(this.tracking.status);
    const statusIndex = this.statuses.indexOf(status);
    return statusIndex <= currentIndex;
  }
}
export class TrackOrder {}