import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          // Role-based routing driven by server-issued JWT claims
          const role = this.authService.currentUser?.role?.toLowerCase();
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            if (role === 'admin') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/products']);
            }
          }, 800);
        } else {
          this.error = response.message ?? 'Login failed. Please check your credentials.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}