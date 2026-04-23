import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (this.authService.isAuthenticated() && user) {
      // Check if token is expired
      if (user.expiresAt) {
        const expiryDate = new Date(user.expiresAt);
        if (expiryDate <= new Date()) {
          this.authService.logout();
          return false;
        }
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
