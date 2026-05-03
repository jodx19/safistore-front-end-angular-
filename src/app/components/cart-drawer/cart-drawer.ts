import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.html',
  styleUrls: ['./cart-drawer.css']
})
export class CartDrawerComponent implements OnInit {
  isOpen = false;
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cartDrawerOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal().total;
    });
  }

  closeDrawer() {
    this.cartService.closeCartDrawer();
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(itemId, quantity);
    }
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId);
  }

  checkout() {
    this.closeDrawer();
    this.router.navigate(['/checkout']);
  }
  
  viewCart() {
    this.closeDrawer();
    this.router.navigate(['/cart']);
  }
}
