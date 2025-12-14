
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TrackingStatus {
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'in-transit' | 'delivered';
  location: string;
  estimatedDelivery: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private trackingData = new BehaviorSubject<TrackingStatus | null>(null);
  public tracking$ = this.trackingData.asObservable();

  constructor() {}

  trackOrder(orderNumber: string): Observable<TrackingStatus> {
    // محاكاة البيانات
    const mockTracking: TrackingStatus = {
      orderNumber,
      status: 'in-transit',
      location: 'Cairo, Egypt',
      estimatedDelivery: '2025-11-10',
      timestamp: new Date()
    };

    this.trackingData.next(mockTracking);
    return this.tracking$ as Observable<TrackingStatus>;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-yellow-100 text-yellow-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✓';
      case 'shipped': return '📦';
      case 'in-transit': return '🚚';
      case 'delivered': return '✓✓';
      default: return '';
    }
  }
}