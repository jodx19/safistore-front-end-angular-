import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth.service';
import { WishlistService } from '../../../services/wishlist.service';
import { BellNotificationService } from '../../../services/bell-notification.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  bellNotificationService = inject(BellNotificationService);
  
  isScrolled = false;
  isMenuOpen = false;
  showNotifications = false;
  
  cartCount$ = this.cartService.cartCount$;
  currentUser$ = this.authService.currentUser$;
  wishlistCount$ = this.wishlistService.wishlistItems$.pipe(
    map(items => items.length)
  );

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  markAllRead() {
    this.bellNotificationService.markAllAsRead();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container')) {
      this.showNotifications = false;
    }
  }

  logout() {
    this.authService.logout();
  }
}
