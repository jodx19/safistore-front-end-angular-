import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BadgeComponent, RevealDirective],
  template: `
    <section appReveal class="relative min-h-[90vh] lg:h-[100vh] w-full overflow-hidden flex items-center">
      <div class="max-w-[1200px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        <!-- Left: Text Content -->
        <div class="flex flex-col items-start text-left">
          <app-badge variant="primary" size="md" [pulse]="true" class="mb-6 animate-fade-up">
            ● NEW COLLECTION 2025
          </app-badge>

          <h1 class="font-display text-5xl md:text-7xl lg:text-[72px] font-extrabold leading-[1.1] text-white mb-6">
            <span class="block animate-fade-up [animation-delay:100ms]">Elevate</span>
            <span class="block animate-fade-up [animation-delay:200ms]">Your</span>
            <span class="block bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent animate-fade-up [animation-delay:300ms]">
              Lifestyle
            </span>
          </h1>

          <p class="text-[16px] md:text-lg text-brand-white/50 max-w-[440px] leading-relaxed mb-10 animate-fade-up [animation-delay:400ms]">
            Discover premium products crafted with precision. Designed for those who appreciate the extraordinary and demand the best in performance.
          </p>

          <div class="flex flex-wrap gap-4 mb-16 animate-fade-up [animation-delay:500ms]">
            <a routerLink="/products" class="contents">
              <app-button variant="primary" size="lg">Explore Collection</app-button>
            </a>
            <a routerLink="/products" class="contents">
              <app-button variant="secondary" size="lg">Shop Now →</app-button>
            </a>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-8 md:gap-12 animate-fade-up [animation-delay:600ms]">
            <div class="flex flex-col">
              <span class="font-display text-2xl font-bold text-white">50K+</span>
              <span class="text-[13px] text-brand-muted uppercase tracking-wider">Customers</span>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col">
              <span class="font-display text-2xl font-bold text-white">200K+</span>
              <span class="text-[13px] text-brand-muted uppercase tracking-wider">Products</span>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col">
              <span class="font-display text-2xl font-bold text-white">99.9%</span>
              <span class="text-[13px] text-brand-muted uppercase tracking-wider">Uptime</span>
            </div>
          </div>
        </div>

        <!-- Right: Product Visual -->
        <div class="relative flex justify-center lg:justify-end animate-fade-up [animation-delay:400ms]">
          <!-- Glow behind -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-blue/20 blur-[80px] rounded-full"></div>
          
          <!-- Floating Card -->
          <div class="relative w-full max-w-[380px] aspect-[4/5] bg-brand-card/30 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-card animate-float">
            
            <!-- Product Image -->
            <div class="relative w-full h-full flex flex-col pt-4">
              <img src="/assets/images/hero_smartwatch.png" alt="Premium Smartwatch" class="w-full object-contain mb-8 drop-shadow-2xl">
              
              <div class="mt-auto">
                 <div class="flex items-center gap-1 mb-2">
                  <div class="flex text-brand-blue text-sm">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span class="text-xs text-brand-muted">(4.9)</span>
                </div>
                <h3 class="font-display text-xl text-white">Elite Series Catalyst</h3>
              </div>
            </div>

            <!-- Floating Badges -->
            <div class="absolute -top-4 -right-4 bg-gradient-to-tr from-brand-blue to-brand-purple px-4 py-2 rounded-xl border border-white/20 shadow-glow">
              <span class="font-display text-sm font-bold text-white">From $399</span>
            </div>
            
            <div class="absolute top-12 -left-6 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-white border border-white/10">
              -20% OFF
            </div>

            <div class="absolute bottom-12 -right-8 bg-green-500/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-white border border-white/10">
              FREE SHIPPING
            </div>
          </div>
        </div>

      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span class="text-[10px] text-brand-white/30 tracking-[0.3em] font-medium uppercase">Scroll</span>
        <div class="w-px h-12 bg-gradient-to-b from-brand-blue to-transparent"></div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class HeroComponent {}
