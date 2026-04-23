import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  checkoutForm = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  };

  isSubmitting = false;
  orderSuccess = false;
  orderNumber = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  submitOrder() {
    // Prevent double submission
    if (this.isSubmitting) return;

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Prepare order payload matching backend's CreateOrderDto
    const orderPayload = {
      shippingAddress: `${this.checkoutForm.address}, ${this.checkoutForm.city}, ${this.checkoutForm.postalCode}, ${this.checkoutForm.country}`,
      city: this.checkoutForm.city,
      country: this.checkoutForm.country,
      postalCode: this.checkoutForm.postalCode,
      paymentMethod: 'Credit Card' // Default payment method
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (order) => {
        this.orderSuccess = true;
        this.orderNumber = `ORD-${String(order).padStart(6, '0')}`;
        
        // Clear cart after successful order
        this.cartService.clearCart();
        
        this.notificationService.showSuccess('✅ Order placed successfully!');
        
        // Redirect to order review page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 3000);
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        this.notificationService.showError('❌ Failed to place order. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.checkoutForm.firstName?.trim() || !this.checkoutForm.lastName?.trim()) {
      this.notificationService.showError('❌ Please enter your full name');
      return false;
    }
    
    if (!this.checkoutForm.email?.trim()) {
      this.notificationService.showError('❌ Please enter your email');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.checkoutForm.email)) {
      this.notificationService.showError('❌ Please enter a valid email address');
      return false;
    }
    
    if (!this.checkoutForm.address?.trim()) {
      this.notificationService.showError('❌ Please enter your street address');
      return false;
    }
    
    if (!this.checkoutForm.city?.trim()) {
      this.notificationService.showError('❌ Please enter your city');
      return false;
    }
    
    if (!this.checkoutForm.postalCode?.trim()) {
      this.notificationService.showError('❌ Please enter your postal code');
      return false;
    }
    
    if (!this.checkoutForm.country?.trim()) {
      this.notificationService.showError('❌ Please enter your country');
      return false;
    }
    
    return true;
  }
}
