import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = '';

  constructor(private authService: AuthService, private router: Router) {}

  get adminInitial(): string {
    const user = this.authService.currentUser;
    if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'A';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
