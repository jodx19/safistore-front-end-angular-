import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto, RegisterRequestDto } from '../api-client/api-client';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  activeTab: 'login' | 'register' = 'login';
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showLoginPass = false;
  showRegPass = false;
  showConfirmPass = false;
  isLoginLoading = false;
  isRegLoading = false;
  termsChecked = false;
  passwordStrength = 0;
  loginError = '';
  registerError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: AbstractControl) {
    const pass = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  switchTab(tab: 'login' | 'register') {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.loginForm.reset();
    this.registerForm.reset();
    this.termsChecked = false;
    this.passwordStrength = 0;
    this.showLoginPass = false;
    this.showRegPass = false;
    this.showConfirmPass = false;
    this.loginError = '';
    this.registerError = '';
  }

  calcStrength(val: string) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    this.passwordStrength = score;
  }

  getStrengthColor(index: number): string {
    if (index > this.passwordStrength) {
      return 'rgba(255,255,255,0.1)';
    }
    const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
    return colors[this.passwordStrength];
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  getError(form: FormGroup, field: string): string {
    const c = form.get(field);
    if (!c?.errors || !(c.dirty || c.touched)) return '';
    if (c.errors['required']) return 'This field is required';
    if (c.errors['email']) return 'Please enter a valid email address';
    if (c.errors['minlength']) {
      return `Minimum ${c.errors['minlength'].requiredLength} characters`;
    }
    if (c.errors['pattern']) return 'Must include uppercase, number and symbol';
    return '';
  }

  hasFormError(form: FormGroup, error: string): boolean {
    return !!(form.errors?.[error] && form.get('confirmPassword')?.touched);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoginLoading = true;
    this.loginError = '';

    const dto: LoginRequestDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(dto).subscribe({
      next: (response) => {
        this.isLoginLoading = false;
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.loginError = response.message || 'Login failed. Please try again.';
        }
      },
      error: (err) => {
        this.isLoginLoading = false;
        this.loginError = err?.error?.message || err?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid || !this.termsChecked) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isRegLoading = true;
    this.registerError = '';

    const dto: RegisterRequestDto = {
      fullName: this.registerForm.value.fullName.trim(),
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };

    this.authService.register(dto).subscribe({
      next: (response) => {
        this.isRegLoading = false;
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.registerError = response.message || 'Registration failed. Please try again.';
        }
      },
      error: (err) => {
        this.isRegLoading = false;
        this.registerError = err?.error?.message || err?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
