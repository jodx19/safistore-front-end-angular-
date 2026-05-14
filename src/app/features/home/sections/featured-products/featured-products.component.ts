import { Component } from '@angular/core';
import { ProductGridComponent } from '../../../../components/product/product-grid/product-grid.component';
import { getFeaturedProducts } from '../../../../data/mock-data';
import { Product } from '../../../../services/product';
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
    const mockProducts = getFeaturedProducts().slice(0, 8);
    this.featuredProducts = mockProducts.map(p => ({
      id: p.id,
      title: p.title || p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      categoryName: p.category,
      imageUrl: p.thumbnail || p.images?.[0],
      image: p.thumbnail || p.images?.[0],
      rating: p.rating,
      categoryId: 0,
      name: p.name,
      brand: p.brand,
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      isSale: p.isSale,
      comparePrice: p.comparePrice,
      shortDescription: p.shortDescription,
      images: p.images,
      thumbnail: p.thumbnail,
      reviewCount: p.reviewCount,
      category: p.category
    }));
  }

  onWishlistToggle(product: Product): void {
    // Wishlist toggle is handled by the service
  }
}
