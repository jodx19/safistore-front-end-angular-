import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CartItem, CartService } from '../../services/cart';
import { CurrentUser } from '../../services/auth.service';
import { OrderClient, CheckoutDto } from '../../api-client/api-client';

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

const createShippingAddress = (user: CurrentUser): string => {
  return `${user.firstName} ${user.lastName}, ${user.email}`.trim();
};

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

  buildCreateOrderRequest(user: CurrentUser, items: CartItem[]): any {
    // Note: CheckoutDto only expects shippingAddress (string) currently in ApiClient,
    // but the backend might expect items. If items are handled by the cart on backend, 
    // we only send address. If not, we'll need to update CheckoutDto.
    return {
      shippingAddress: createShippingAddress(user)
    };
  }
}
