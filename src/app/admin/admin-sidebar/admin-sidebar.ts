import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <aside class="fixed top-0 left-0 h-full w-[260px] bg-[#050B18] border-r border-[rgba(255,255,255,0.06)] z-50 flex flex-col overflow-y-auto">

      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-6 border-b border-[rgba(255,255,255,0.06)]">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C4FF6] to-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(108,79,246,0.5)]">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="font-display text-[18px] text-white font-bold">
          <span class="text-[#94A3B8] font-normal">Safi</span>Store
          <span class="ml-1 text-[10px] text-[#6C4FF6] bg-[rgba(108,79,246,0.15)] border border-[rgba(108,79,246,0.3)] px-1.5 py-0.5 rounded-full font-bold tracking-wider">ADMIN</span>
        </div>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 px-3 py-6 space-y-1">
        @for (item of navItems; track item.label) {
          <a [routerLink]="item.route"
             routerLinkActive="sidebar-active"
             [routerLinkActiveOptions]="{exact: item.exact ?? false}"
             class="sidebar-link group flex items-center gap-3 px-4 py-3 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all duration-200 relative">
            <span class="text-lg flex-shrink-0" [innerHTML]="item.icon"></span>
            <span class="text-[14px] font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Bottom: User Info -->
      <div class="px-4 py-4 border-t border-[rgba(255,255,255,0.06)]">
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C4FF6] to-[#3B82F6] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
            {{ adminInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-[13px] font-semibold truncate">{{ adminName }}</p>
            <p class="text-[#94A3B8] text-[11px]">Administrator</p>
          </div>
          <button (click)="logout()" title="Logout"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-red-400 hover:bg-red-400/10 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
        <a routerLink="/" class="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all text-[13px]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Store
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-link.sidebar-active {
      background: rgba(108, 79, 246, 0.12);
      color: #ffffff;
      border: 1px solid rgba(108, 79, 246, 0.25);
    }
    .sidebar-link.sidebar-active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: linear-gradient(to bottom, #6C4FF6, #3B82F6);
      border-radius: 0 4px 4px 0;
    }
    aside {
      scrollbar-width: thin;
      scrollbar-color: rgba(108,79,246,0.3) transparent;
    }
  `]
})
export class AdminSidebarComponent {
  navItems = [
    { label: 'Dashboard',  route: '/admin/dashboard',  icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"/></svg>', exact: true },
    { label: 'Products',   route: '/admin/products',   icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { label: 'Orders',     route: '/admin/orders',     icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
    { label: 'Customers',  route: '/admin/customers',  icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
    { label: 'Analytics',  route: '/admin/analytics',  icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
    { label: 'Settings',   route: '/admin/settings',   icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>' },
  ];

  get adminName(): string {
    const u = this.authService.currentUser;
    return u ? `${u.firstName} ${u.lastName}`.trim() || u.email : 'Admin';
  }

  get adminInitial(): string {
    const u = this.authService.currentUser;
    return (u?.firstName?.charAt(0) || u?.email?.charAt(0) || 'A').toUpperCase();
  }

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
