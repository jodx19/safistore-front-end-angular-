
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
  loginRole: 'user' | 'admin' = 'user';
  loading = false;
  error = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    // تمرير الدور المختار
    this.authService.login(this.email, this.password, this.loginRole).subscribe(
      (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = `Login successful as ${this.loginRole}! Redirecting...`;
          setTimeout(() => {
            // توجيه بناءً على الدور
            if (this.loginRole === 'admin') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/products']);
            }
          }, 1500);
        } else {
          this.error = response.message;
        }
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}