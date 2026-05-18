
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrderClient, OrderDto } from '../api-client/api-client';

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

  constructor(private orderClient: OrderClient) {}

  trackOrder(orderNumber: string): Observable<TrackingStatus> {
    const id = parseInt(orderNumber.replace(/\D/g, ''), 10) || 0;
    return this.orderClient.getById(id).pipe(
      map((resp: any) => {
        const order: OrderDto = resp?.data ?? resp;
        const now = new Date();
        return {
          orderNumber: orderNumber,
          status: (order.status?.toLowerCase() || 'pending') as TrackingStatus['status'],
          location: order.shippingAddress || 'Processing',
          estimatedDelivery: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          timestamp: order.createdAt ? new Date(order.createdAt) : now
        };
      })
    );
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