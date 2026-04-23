import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OrderClient, CreateOrderDto, OrderDto } from '../api-client/api-client';

export interface OrderItem {
  productId: number;
  productName?: string;
  unitPrice?: number;
  quantity: number;
  totalPrice?: number;
  // Backward compatibility
  title?: string;
  price?: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
}

/** Local alias – mirrors OrderDto but keeps templates compiling */
export interface Order {
  id: number;
  userId: string | number;
  items: OrderItem[];
  totalPrice?: number;
  totalAmount?: number;
  total?: number;
  status: string;
  shippingAddress: string;
  city?: string;
  country?: string;
  postalCode?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private orderClient: OrderClient) { }

  private handleError(error: any): Observable<never> {
    const message = error?.error?.message ?? error?.message ?? 'Failed to process order';
    return throwError(() => new Error(message));
  }

  /** Creates an order – returns the new order ID from the backend */
  createOrder(request: CreateOrderDto): Observable<number> {
    return this.orderClient.checkout(request).pipe(
      map(res => (res as any).data),
      catchError(err => this.handleError(err))
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.orderClient.getById(id).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items ?? []
      } as Order)),
      catchError(err => this.handleError(err))
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.orderClient.getMyOrders().pipe(
      map(res => (res.data ?? []).map(order => ({
        ...order,
        items: order.items ?? []
      } as Order))),
      catchError(err => this.handleError(err))
    );
  }
}
