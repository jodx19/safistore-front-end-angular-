import { Component } from '@angular/core';
import { ProductGridComponent } from '../../../../components/product/product-grid/product-grid.component';
import { getFeaturedProducts, Product } from '../../../../data/mock-data';
import { CartService } from '../../../../services/cart';
import { WishlistService } from '../../../../services/wishlist.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [ProductGridComponent],
  template: `
    <section class="py-24 px-6 overflow-hidden">
      <div class="max-w-[1200px] mx-auto">
        
        <div class="mb-16 text-center">
          <span class="block text-[11px] font-semibold text-accent-purple tracking-[0.3em] uppercase mb-4">
            CURATED SELECTION
          </span>
          <h2 class="font-display text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Featured Products
          </h2>
          <p class="text-text-secondary max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech products, chosen for their exceptional quality and innovative design.
          </p>
        </div>

        <app-product-grid 
          [products]="featuredProducts"
          [columns]="4"
          [showWishlist]="true"
          [showQuickView]="true"
          (onWishlistToggle)="onWishlistToggle($event)"
        ></app-product-grid>

        <div class="text-center mt-12">
          <a routerLink="/products" class="btn-secondary">
            View All Products
          </a>
        </div>

      </div>
    </section>
  `
})
export class FeaturedProductsComponent {
  featuredProducts: Product[] = [];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    this.featuredProducts = getFeaturedProducts().slice(0, 8); // Show first 8 featured products
  }

  onWishlistToggle(product: Product): void {
    // Wishlist toggle is handled by the service
  }
}
