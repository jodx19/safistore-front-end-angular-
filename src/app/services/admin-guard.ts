import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    this.notificationService.showError('You do not have permission to access this page. Admin access required.');
    this.router.navigate(['/products']);
    return false;
  }
}