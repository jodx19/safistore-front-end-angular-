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

  constructor(private cartService: CartService, public router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal().total;
    });
  }

  closeDrawer() {
    // Close drawer by setting isOpen to false
    this.isOpen = false;
    document.body.style.overflow = '';
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
