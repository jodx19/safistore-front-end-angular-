import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

// NOTE: CVV should NEVER be sent to your own backend.
// It must only be sent directly to the payment gateway (Stripe, etc.).
// The paymentInfo stored here should only be masked card data.
export interface PaymentInfo {
  cardNumber: string;  // masked, e.g. "**** **** **** 1234"
  expiryDate: string;
}

export interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  shippingAddress: ShippingAddress;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.orders}`;

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    const message = error?.error?.error?.message ?? error?.message ?? 'Failed to process order';
    return throwError(() => new Error(message));
  }

  /** Create a new order. Authorization header is attached by AuthInterceptor. */
  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<{ success: boolean; data: Order }>(this.apiUrl, request).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  /** Get a single order by ID. */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/${orderId}`).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  /** Get all orders for the currently authenticated user. */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<{ success: boolean; data: Order[] }>(`${this.apiUrl}/my`).pipe(
      map(res => res.data ?? []),
      catchError(err => this.handleError(err))
    );
  }

  /** Get orders by customer ID (Admin only). */
  getOrdersByCustomer(customerId: string): Observable<Order[]> {
    return this.http
      .get<{ success: boolean; data: Order[] }>(`${this.apiUrl}?customerId=${customerId}`)
      .pipe(
        map(res => res.data ?? []),
        catchError(err => this.handleError(err))
      );
  }

  /** Update order status (Admin only). */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    return this.http
      .patch<{ success: boolean; data: Order }>(`${this.apiUrl}/${orderId}/status`, { status })
      .pipe(
        map(res => res.data),
        catchError(err => this.handleError(err))
      );
  }

  /** Cancel an order. */
  cancelOrder(orderId: string): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${orderId}/cancel`, {})
      .pipe(catchError(err => this.handleError(err)));
  }
}
