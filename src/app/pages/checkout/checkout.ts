import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

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
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  };

  orderPlaced = false;
  orderNumber = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  submitOrder() {
    if (this.validateForm()) {
      this.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.orderPlaced = true;
      setTimeout(() => {
        this.orderPlaced = false;
        this.router.navigate(['/']);
      }, 5000);
    }
  }

  validateForm(): boolean {
    if (!this.checkoutForm.firstName || !this.checkoutForm.lastName) {
      this.notificationService.showError('Please enter your name');
      return false;
    }
    if (!this.checkoutForm.email) {
      this.notificationService.showError('Please enter your email');
      return false;
    }
    if (!this.checkoutForm.address || !this.checkoutForm.city) {
      this.notificationService.showError('Please enter your address');
      return false;
    }
    if (!this.checkoutForm.cardNumber) {
      this.notificationService.showError('Please enter card number');
      return false;
    }
    return true;
  }
}
