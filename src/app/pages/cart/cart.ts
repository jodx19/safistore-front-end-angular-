import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  shipping = 10;
  total = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.tax = +(this.subtotal * 0.1).toFixed(2);
    this.total = +(this.subtotal + this.tax + this.shipping).toFixed(2);
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(itemId, quantity);
    }
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  proceedToCheckout() {
    if (!this.cartItems || this.cartItems.length === 0) {
      this.notificationService.showWarning('🛒 Your cart is empty. Please add products before proceeding.');
      return;
    }

    // ✅ Prevent checkout without login
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('Please log in to proceed to checkout.');
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
