import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth.service';
import { WishlistService } from '../../../services/wishlist.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  
  isScrolled = false;
  isMenuOpen = false;
  
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

  logout() {
    this.authService.logout();
  }
}
