import { Component, inject } from '@angular/core';
import { ProductCardComponent, Product } from '../../../../shared/components/product-card/product-card.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [ProductCardComponent, RevealDirective],
  template: `
    <section class="py-24 px-6 overflow-hidden">
      <div class="max-w-[1200px] mx-auto">
        
        <div class="mb-16">
          <span appReveal class="block text-[11px] font-semibold text-brand-blue tracking-[0.3em] uppercase mb-4">
            PREMIUM SELECTION
          </span>
          <h2 [appReveal]="0.1" class="font-display text-4xl md:text-5xl font-extrabold text-white">
            Featured Products
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (product of products; track product.id; let i = $index) {
            <app-product-card 
              [product]="product"
              [animDelay]="i * 0.1"
              (addToCart)="onAddToCart($event)"
            ></app-product-card>
          }
        </div>

      </div>
    </section>
  `
})
export class FeaturedProductsComponent {
  private cartService = inject(CartService);

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  products: Product[] = [
    {
      id: 1,
      name: 'Sonic Master Pro',
      category: 'Audio',
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.8,
      reviews: 124,
      image: '/assets/images/headphones.png'
    },
    {
      id: 2,
      name: 'Titan Spectre X',
      category: 'Laptops',
      price: 1899,
      rating: 4.9,
      reviews: 86,
      image: '/assets/images/laptop.png'
    },
    {
      id: 3,
      name: 'Elite Series Catalyst',
      category: 'Wearables',
      price: 399,
      originalPrice: 499,
      discount: 20,
      rating: 4.9,
      reviews: 212,
      image: '/assets/images/hero_smartwatch.png'
    },
    {
      id: 4,
      name: 'Neural Key 75',
      category: 'Gaming',
      price: 159,
      rating: 4.7,
      reviews: 342,
      image: '/assets/images/keyboard.png'
    }
  ];
}
