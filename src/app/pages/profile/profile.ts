import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Matches `GET /api/v1/auth/me` — raw `UserDto` body (no ApiResponse wrapper). */
interface AuthMeUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  roles: string[];
  createdAt: string;
}

/** Matches `AuthResponse` on profile / password change success. */
interface AuthActionResponse {
  success: boolean;
  message: string;
  user?: AuthMeUserDto;
  errors?: string[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isUpdating = false;
  isChangingPassword = false;
  showPasswordForm = false;
  isLoading = true;

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.http.get<AuthMeUserDto>(`${this.apiUrl}/me`).subscribe({
      next: (user) => {
        this.profileForm.firstName = user.firstName || '';
        this.profileForm.lastName = user.lastName || '';
        this.profileForm.email = user.email || '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.notificationService.showError('❌ Failed to load profile data.');
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    if (!this.validateProfileForm()) return;

    this.isUpdating = true;

    const updateData = {
      firstName: this.profileForm.firstName,
      lastName: this.profileForm.lastName,
      address: this.profileForm.address,
      city: this.profileForm.city,
      country: this.profileForm.country,
      postalCode: this.profileForm.postalCode
    };

    this.http.put<AuthActionResponse>(`${this.apiUrl}/profile`, updateData).subscribe({
      next: (response) => {
        if (response?.success) {
          this.notificationService.showSuccess('✅ Profile updated successfully!');
          if (response.user) {
            const updatedUser: any = {
              ...this.authService.currentUser,
              firstName: response.user.firstName,
              lastName: response.user.lastName
            };
            this.authService.updateCurrentUser(updatedUser);
          }
        }
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Profile update failed:', error);
        const message = error?.error?.message || error?.error?.error?.message || 'Failed to update profile';
        this.notificationService.showError(`❌ ${message}`);
        this.isUpdating = false;
      }
    });
  }

  changePassword(): void {
    if (!this.validatePasswordForm()) return;

    this.isChangingPassword = true;

    this.http.post<AuthActionResponse>(`${this.apiUrl}/change-password`, {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
      confirmPassword: this.passwordForm.confirmPassword
    }).subscribe({
      next: (response) => {
        if (response?.success) {
          this.notificationService.showSuccess('✅ Password changed successfully!');
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
          this.showPasswordForm = false;
        }
        this.isChangingPassword = false;
      },
      error: (error) => {
        console.error('Password change failed:', error);
        const message = error?.error?.message || error?.error?.error?.message || 'Failed to change password';
        this.notificationService.showError(`❌ ${message}`);
        this.isChangingPassword = false;
      }
    });
  }

  validateProfileForm(): boolean {
    if (!this.profileForm.firstName?.trim()) {
      this.notificationService.showError('❌ First name is required');
      return false;
    }
    if (!this.profileForm.lastName?.trim()) {
      this.notificationService.showError('❌ Last name is required');
      return false;
    }
    return true;
  }

  validatePasswordForm(): boolean {
    if (!this.passwordForm.currentPassword) {
      this.notificationService.showError('❌ Current password is required');
      return false;
    }
    if (!this.passwordForm.newPassword) {
      this.notificationService.showError('❌ New password is required');
      return false;
    }
    if (this.passwordForm.newPassword.length < 8) {
      this.notificationService.showError('❌ Password must be at least 8 characters');
      return false;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.notificationService.showError('❌ Passwords do not match');
      return false;
    }
    return true;
  }

  logout(): void {
    this.authService.logout();
  }
}
