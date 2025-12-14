import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + environment.endpoints.orders;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Order API Error:', error);
    return throwError(() => new Error('Failed to process order'));
  }

  // Backend Integration Stub for Production
  // TODO: Replace with actual backend API endpoints

  // Create new order
  createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    // Stub: Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        try {
          // Validate order data
          if (!order.items || order.items.length === 0) {
            throw new Error('Order must contain at least one item');
          }
          if (!order.shippingAddress || !order.paymentInfo) {
            throw new Error('Shipping address and payment info are required');
          }

          const newOrder: Order = {
            ...order,
            id: 'ORD-' + Date.now().toString(),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          console.log('Order created (stub):', newOrder);
          observer.next(newOrder);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      }, 1000); // Simulate network delay
    });
  }

  // Get order by ID
  getOrderById(orderId: string): Observable<Order> {
    // Stub: Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        // Mock order data
        const mockOrder: Order = {
          id: orderId,
          customerId: 'user123',
          items: [
            {
              productId: 1,
              title: 'Sample Product',
              price: 99.99,
              quantity: 1,
              image: 'https://via.placeholder.com/100'
            }
          ],
          total: 99.99,
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            address: '123 Main St',
            city: 'New York',
            postalCode: '10001',
            country: 'USA'
          },
          paymentInfo: {
            cardNumber: '**** **** **** 1234',
            expiryDate: '12/25',
            cvv: '***'
          },
          status: 'processing',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log('Order retrieved (stub):', mockOrder);
        observer.next(mockOrder);
        observer.complete();
      }, 500);
    });
  }

  // Get orders by customer ID
  getOrdersByCustomer(customerId: string): Observable<Order[]> {
    // Stub: Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: 'ORD-123456',
            customerId,
            items: [],
            total: 149.99,
            shippingAddress: {} as any,
            paymentInfo: {} as any,
            status: 'delivered',
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000)
          }
        ];

        console.log('Customer orders retrieved (stub):', mockOrders);
        observer.next(mockOrders);
        observer.complete();
      }, 500);
    });
  }

  // Update order status (Admin)
  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    // Stub: Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        console.log('Order status updated (stub):', { orderId, status });
        observer.next({
          id: orderId,
          status,
          updatedAt: new Date()
        } as Order);
        observer.complete();
      }, 500);
    });
  }

  // Cancel order
  cancelOrder(orderId: string): Observable<void> {
    // Stub: Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        console.log('Order cancelled (stub):', orderId);
        observer.next();
        observer.complete();
      }, 500);
    });
  }

  // Process payment (Integration with payment gateway)
  processPayment(orderData: any): Observable<{ success: boolean; transactionId?: string; error?: string }> {
    // Stub: Simulate payment processing
    return new Observable(observer => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for demo
        if (success) {
          console.log('Payment processed successfully (stub)');
          observer.next({
            success: true,
            transactionId: 'TXN-' + Date.now()
          });
        } else {
          console.log('Payment failed (stub)');
          observer.next({
            success: false,
            error: 'Payment declined by issuer'
          });
        }
        observer.complete();
      }, 2000); // Simulate payment processing delay
    });
  }

  // Send order confirmation email
  sendOrderConfirmation(orderId: string): Observable<void> {
    // Stub: Simulate email sending
    return new Observable(observer => {
      setTimeout(() => {
        console.log('Order confirmation email sent (stub):', orderId);
        observer.next();
        observer.complete();
      }, 300);
    });
  }
}
