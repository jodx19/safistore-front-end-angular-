import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Extract email and token from URL query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      
      if (!this.email || !this.token) {
        this.notificationService.showError('❌ Invalid or expired reset link');
        setTimeout(() => this.router.navigate(['/forgot-password']), 3000);
      }
    });
  }

  resetPassword(): void {
    if (!this.validateForm()) return;

    this.loading = true;

    const payload = {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.http.post(`${environment.apiUrl}/auth/reset-password`, payload).subscribe({
      next: (response: any) => {
        this.isSuccess = true;
        this.notificationService.showSuccess('✅ Password reset successfully!');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (error) => {
        console.error('Reset password failed:', error);
        const message = error?.error?.message || '❌ Failed to reset password';
        this.notificationService.showError(message);
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    // Password validation - must match backend rules
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    
    if (!this.newPassword || this.newPassword.length < 8) {
      this.notificationService.showError('Password must be at least 8 characters');
      return false;
    }

    if (!passwordRegex.test(this.newPassword)) {
      this.notificationService.showError('Password must contain: uppercase letter, number, and special character');
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showError('Passwords do not match');
      return false;
    }

    return true;
  }

  get isPasswordValid(): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(this.newPassword) && this.newPassword.length >= 8;
  }

  get doPasswordsMatch(): boolean {
    return this.confirmPassword.length > 0 && this.newPassword === this.confirmPassword;
  }
}
