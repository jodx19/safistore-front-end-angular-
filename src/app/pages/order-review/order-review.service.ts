import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CartItem, CartService } from '../../services/cart';
import { CurrentUser } from '../../services/auth.service';
import { CreateOrderRequest } from '../../services/order.service';

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderDetails {
  items: CartItem[];
  totals: CartTotals;
  isEmpty: boolean;
}

const mapCartItemToOrderRequestItem = (item: CartItem): { productId: number; quantity: number } => ({
  productId: item.id,
  quantity: item.quantity
});

const createShippingAddress = (user: CurrentUser): CreateOrderRequest['shippingAddress'] => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

@Injectable({
  providedIn: 'root'
})
export class OrderReviewService {
  constructor(private cartService: CartService) {}

  getOrderDetails(items: CartItem[]): OrderDetails {
    const totals = this.cartService.getCartTotal();
    return {
      items,
      totals,
      isEmpty: items.length === 0
    };
  }

  getOrderReview(): Observable<OrderDetails> {
    return this.cartService.cartItems$.pipe(
      map(items => this.getOrderDetails(items))
    );
  }

  buildCreateOrderRequest(user: CurrentUser, items: CartItem[]): CreateOrderRequest {
    return {
      items: items.map(mapCartItemToOrderRequestItem),
      shippingAddress: createShippingAddress(user)
    };
  }
}
