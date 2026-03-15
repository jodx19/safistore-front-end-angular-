import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  cartCount$ = this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );

  constructor() {}

  addToCart(product: any) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.itemsSubject.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };
      this.itemsSubject.next([...currentItems, newItem]);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.itemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.itemsSubject.next(updatedItems);
  }

  clearCart() {
    this.itemsSubject.next([]);
  }
}
