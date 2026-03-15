import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { RevealDirective } from '../../directives/reveal.directive';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent, ButtonComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      [appReveal]="animDelay"
      class="group w-full max-w-[280px] bg-brand-card/80 border border-white/5 rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-brand-blue/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(74,108,247,0.15)]"
    >
      <!-- Image Area -->
      <div class="relative aspect-square overflow-hidden bg-white/5">
        <a [routerLink]="['/products', product.id]" class="block w-full h-full">
          <img 
            [src]="product.image" 
            [alt]="product.name"
            class="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          >
        </a>
        
        <!-- Badges -->
        @if (product.discount) {
          <div class="absolute top-0 left-0 p-3 pointer-events-none">
            <app-badge variant="danger" size="sm">
              -{{ product.discount }}%
            </app-badge>
          </div>
        }

        <!-- Quick Actions Overlay -->
        <div class="absolute bottom-0 left-0 w-full p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-brand-navy/90 backdrop-blur-md flex gap-2">
          <app-button class="flex-1" size="sm" (onClick)="addToCart.emit(product)">
            Add to Cart
          </app-button>
          <button (click)="addToWishlist.emit(product)" class="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-5">
        <span class="text-[11px] font-medium text-brand-blue tracking-widest uppercase">{{ product.category }}</span>
        <a [routerLink]="['/products', product.id]">
          <h3 class="font-display text-[17px] text-white mt-1 mb-2 line-clamp-1 hover:text-brand-blue transition-colors">{{ product.name }}</h3>
        </a>
        
        <!-- Stars -->
        <div class="flex items-center gap-1 mb-4">
          <div class="flex text-yellow-400">
            @for (s of [1,2,3,4,5]; track s) {
              <span>★</span>
            }
          </div>
          <span class="text-[12px] text-brand-muted ml-1">({{ product.rating }})</span>
          <span class="text-[12px] text-brand-muted/50 border-l border-white/10 pl-2 ml-2">{{ product.reviews }} reviews</span>
        </div>

        <!-- Price -->
        <div class="flex items-center justify-between mt-auto">
          <div class="flex flex-col">
            @if (product.originalPrice) {
              <span class="text-[13px] text-brand-muted/30 line-through">
                \${{ product.originalPrice }}
              </span>
            }
            <span class="font-display text-[22px] text-white">
              \${{ product.price }}
            </span>
          </div>
          
          <button 
            (click)="addToCart.emit(product)"
            class="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-glow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() animDelay: number = 0;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
}
