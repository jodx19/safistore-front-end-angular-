import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OrderClient, ApiResponse, OrderDto, CheckoutDto } from '../api-client/api-client';

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
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

export interface Order {
  id: number;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  shippingAddress: string;
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

  createOrder(request: { shippingAddress: string }): Observable<OrderDto> {
    return this.orderClient.checkout(request as CheckoutDto).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  getOrderById(id: number): Observable<OrderDto> {
    return this.orderClient.getById(id).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  getMyOrders(): Observable<OrderDto[]> {
    return this.orderClient.getMyOrders().pipe(
      map(res => res.data ?? []),
      catchError(err => this.handleError(err))
    );
  }

  updateOrderStatus(id: number, status: string): Observable<OrderDto> {
    return this.orderClient.updateStatus(id, status).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  cancelOrder(id: number): Observable<ApiResponse<null>> {
    return this.orderClient.cancelOrder(id).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
