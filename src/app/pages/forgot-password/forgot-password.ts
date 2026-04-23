import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  email = '';
  isSubmitting = false;
  emailSent = false;

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  submitEmail(): void {
    if (!this.email?.trim()) {
      this.notificationService.showError('❌ Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.notificationService.showError('❌ Please enter a valid email address');
      return;
    }

    this.isSubmitting = true;

    this.http.post(`${this.apiUrl}/forgot-password`, { email: this.email }).subscribe({
      next: (response: any) => {
        this.emailSent = true;
        this.notificationService.showSuccess('✅ If the email exists, you will receive a password reset link.');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Forgot password failed:', error);
        // Still show success to prevent email enumeration
        this.emailSent = true;
        this.isSubmitting = false;
      }
    });
  }
}
