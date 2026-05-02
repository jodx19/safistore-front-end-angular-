
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  loading = false;
  error = '';
  successMessage = '';
  agreeToTerms = false;

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (!this.agreeToTerms) {
      this.error = 'You must agree to the terms and conditions';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = 'Registration successful! Redirecting...';
          
          Swal.fire({
            title: `Welcome, ${this.firstName}!`,
            text: 'Your account has been successfully created.',
            icon: 'success',
            background: '#0B132B',
            color: '#fff',
            confirmButtonColor: '#4A6CF7',
            timer: 2000,
            showConfirmButton: false,
            backdrop: `rgba(10, 22, 40, 0.85)`
          }).then(() => {
            this.router.navigate(['/']);
          });
        } else {
          this.error = response.message ?? 'Registration failed.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'An error occurred. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
export class Register { }