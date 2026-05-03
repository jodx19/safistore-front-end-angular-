import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { SpinnerComponent } from '../../components/ui/spinner/spinner.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, BadgeComponent, InputComponent, SpinnerComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  shipping = 10;
  total = 0;
  
  couponCode = '';
  couponApplied = false;
  discount = 0;

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
    // Use the backend-calculated total from cartTotal$
    const totals = this.cartService.getCartTotal();
    this.subtotal = totals.subtotal;
    this.tax = totals.tax;
    this.shipping = totals.shipping;
    
    // Apply discount if coupon is applied
    this.discount = this.couponApplied ? this.subtotal * 0.15 : 0; // 15% discount for demo
    this.total = totals.total - this.discount;
  }

  applyCoupon() {
    if (!this.couponCode.trim()) return;
    
    // Simulate coupon check
    if (this.couponCode.toLowerCase() === 'safi15') {
      this.couponApplied = true;
      this.calculateTotals();
      this.notificationService.showSuccess('Coupon SAFI15 applied successfully! 15% off.');
    } else {
      this.notificationService.showError('Invalid or expired coupon code.');
    }
  }

  removeCoupon() {
    this.couponCode = '';
    this.couponApplied = false;
    this.calculateTotals();
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
