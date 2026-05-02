import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  template: `
    <nav class="fixed top-0 left-0 w-full z-[100] transition-all duration-300 h-[70px] flex items-center"
         [class.scrolled]="isScrolled">
      <div class="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
        
        <!-- Left: Logo -->
        <a routerLink="/" class="flex items-center gap-3 group">
          <div class="w-[10px] h-[10px] rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple animate-pulse-glow"></div>
          <div class="font-display text-[22px] text-white">
            <span class="font-normal opacity-90">Safi</span>
            <span class="font-bold">Store</span>
          </div>
        </a>

        <!-- Center: Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link text-[14px] font-medium text-brand-white/60 hover:text-white">Home</a>
          <a routerLink="/products" routerLinkActive="active" class="nav-link text-[14px] font-medium text-brand-white/60 hover:text-white">Products</a>
          <a routerLink="/track-order" routerLinkActive="active" class="nav-link text-[14px] font-medium text-brand-white/60 hover:text-white">Track Order</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link text-[14px] font-medium text-brand-white/60 hover:text-white">About</a>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-4">
          <!-- Search -->
          <button class="text-brand-white/60 hover:text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Cart -->
          <a routerLink="/cart" class="relative text-brand-white/60 hover:text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            @if ((cartCount$ | async) !== null && (cartCount$ | async)! > 0) {
              <span class="absolute top-0 right-0 h-4 min-w-[16px] px-1 flex items-center justify-center bg-gradient-to-tr from-brand-blue to-brand-purple text-[10px] font-bold text-white rounded-full border border-brand-navy">
                {{ cartCount$ | async }}
              </span>
            }
          </a>

          <!-- Auth -->
          <div class="hidden sm:flex items-center gap-4 ml-2">
            @if (currentUser$ | async; as user) {
              <div class="relative group cursor-pointer flex items-center gap-2 py-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg shadow-brand-blue/20">
                  {{ user.firstName?.charAt(0) || user.email?.charAt(0) || 'U' }}
                </div>
                <span class="text-[14px] font-medium text-white group-hover:text-brand-purple transition-colors">{{ user.firstName || 'Profile' }}</span>
                
                <!-- Dropdown -->
                <div class="absolute top-full right-0 mt-2 w-48 bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div class="p-2 flex flex-col">
                    <a routerLink="/profile" class="px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </a>
                    <a routerLink="/orders" class="px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      My Orders
                    </a>
                    <div class="h-[1px] bg-white/10 my-1"></div>
                    <button (click)="logout()" class="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            } @else {
              <a routerLink="/auth/login" class="text-[14px] font-medium text-brand-white/60 hover:text-white">Login</a>
              <a routerLink="/auth/register" 
                 class="h-10 px-5 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(74,108,247,0.4)]">
                Sign Up
              </a>
            }
          </div>

          <!-- Mobile Toggle -->
          <button class="md:hidden text-brand-white/60 hover:text-white p-2" (click)="toggleMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7' " />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      @if (isMenuOpen) {
        <div class="fixed inset-0 top-[70px] z-[99] bg-brand-navy/95 backdrop-blur-2xl md:hidden overflow-y-auto">
          <div class="flex flex-col gap-6 p-10 pt-16 items-center">
            <a routerLink="/" (click)="isMenuOpen = false" class="text-2xl font-bold text-white">Home</a>
            <a routerLink="/products" (click)="isMenuOpen = false" class="text-2xl font-bold text-white">Products</a>
            <a routerLink="/track-order" (click)="isMenuOpen = false" class="text-2xl font-bold text-white">Track Order</a>
            <a routerLink="/about" (click)="isMenuOpen = false" class="text-2xl font-bold text-white">About</a>
            <div class="flex flex-col gap-4 w-full mt-4">
              @if (currentUser$ | async; as user) {
                <div class="flex items-center gap-4 mb-2 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-xl uppercase">
                    {{ user.firstName?.charAt(0) || user.email?.charAt(0) || 'U' }}
                  </div>
                  <div class="flex flex-col text-left">
                    <div class="text-white font-bold">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-white/60 text-sm truncate w-[180px]">{{ user.email }}</div>
                  </div>
                </div>
                <a routerLink="/profile" (click)="isMenuOpen = false" class="h-14 flex items-center justify-center rounded-xl border border-white/10 text-lg font-medium text-white hover:bg-white/5 transition-colors">My Profile</a>
                <a routerLink="/orders" (click)="isMenuOpen = false" class="h-14 flex items-center justify-center rounded-xl border border-white/10 text-lg font-medium text-white hover:bg-white/5 transition-colors">My Orders</a>
                <button (click)="logout(); isMenuOpen = false" class="h-14 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-lg font-bold border border-red-500/20 transition-colors w-full">Logout</button>
              } @else {
                <a routerLink="/auth/login" (click)="isMenuOpen = false" class="h-14 flex items-center justify-center rounded-xl border border-white/10 text-lg font-medium text-white hover:bg-white/5 transition-colors">Login</a>
                <a routerLink="/auth/register" (click)="isMenuOpen = false" class="h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-lg font-bold text-white shadow-lg shadow-brand-blue/20">Sign Up</a>
              }
            </div>
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    nav.scrolled {
      background: rgba(10, 22, 40, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class NavbarComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  
  isScrolled = false;
  isMenuOpen = false;
  
  cartCount$ = this.cartService.cartCount$;
  currentUser$ = this.authService.currentUser$;

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
