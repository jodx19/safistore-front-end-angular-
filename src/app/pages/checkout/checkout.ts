import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  steps = [
    { num: 1, title: 'Shipping', icon: '📍' },
    { num: 2, title: 'Method', icon: '🚚' },
    { num: 3, title: 'Payment', icon: '💳' },
    { num: 4, title: 'Review', icon: '📋' }
  ];

  checkoutForm = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  };

  shippingMethod = 'standard';
  paymentMethod = 'credit_card';

  cartItems: any[] = [];
  cartTotal = 0;
  orderNumber = '';

  isSubmitting = false;
  orderSuccess = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = items.reduce((acc: number, item: any) => acc + ((item.price || item.priceAtAddition) * item.quantity), 0);
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.firstName = user.firstName || '';
      this.checkoutForm.lastName = user.lastName || '';
      this.checkoutForm.email = user.email || '';
    }
  }

  nextStep() {
    if (this.currentStep === 1 && !this.validateShipping()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentStep++;
  }

  prevStep() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentStep--;
  }

  setStep(step: number) {
    if (step > this.currentStep && !this.validateShipping()) return;
    if (step < this.currentStep || this.currentStep === 4) {
      this.currentStep = step;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  validateShipping(): boolean {
    if (!this.checkoutForm.firstName?.trim() || !this.checkoutForm.lastName?.trim()) {
      this.notificationService.showError('Please enter your full name');
      return false;
    }
    if (!this.checkoutForm.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.checkoutForm.email)) {
      this.notificationService.showError('Please enter a valid email');
      return false;
    }
    if (!this.checkoutForm.address?.trim() || !this.checkoutForm.city?.trim() || !this.checkoutForm.postalCode?.trim() || !this.checkoutForm.country?.trim()) {
      this.notificationService.showError('Please complete your shipping address');
      return false;
    }
    return true;
  }

  submitOrder() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const orderPayload = {
      shippingAddress: `${this.checkoutForm.address}, ${this.checkoutForm.city}, ${this.checkoutForm.postalCode}, ${this.checkoutForm.country}`,
      city: this.checkoutForm.city,
      country: this.checkoutForm.country,
      postalCode: this.checkoutForm.postalCode,
      paymentMethod: this.paymentMethod
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        const orderNumber = `ORD-${String(order).padStart(6, '0')}`;
        this.router.navigate(['/order-success'], { queryParams: { orderNumber, email: this.checkoutForm.email } });
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        this.notificationService.showError('❌ Failed to place order. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  get shippingCost(): number {
    return this.shippingMethod === 'express' ? 15 : 0;
  }

  get finalTotal(): number {
    return this.cartTotal + this.shippingCost;
  }
}
