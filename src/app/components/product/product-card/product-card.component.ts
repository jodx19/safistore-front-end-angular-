import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../data/mock-data';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wishlist.service';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { RatingComponent } from '../../ui/rating/rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, RatingComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showWishlist = true;
  @Input() showQuickView = true;
  @Input() compact = false;
  @Output() onWishlistToggle = new EventEmitter<Product>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  get discountPercentage(): number {
    if (this.product.comparePrice && this.product.comparePrice > this.product.price) {
      return Math.round(((this.product.comparePrice - this.product.price) / this.product.comparePrice) * 100);
    }
    return 0;
  }

  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  get stockStatus(): string {
    if (this.product.stock === 0) return 'Out of Stock';
    if (this.product.stock < 5) return `Only ${this.product.stock} left!`;
    return 'In Stock';
  }

  get stockStatusClass(): string {
    if (this.product.stock === 0) return 'text-error';
    if (this.product.stock < 5) return 'text-warning';
    return 'text-success';
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, 1).subscribe({
      next: (success) => {
        if (success) {
          // Success notification handled by cart service
        }
      }
    });
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product).subscribe({
      next: (success) => {
        if (success) {
          this.onWishlistToggle.emit(this.product);
        }
      }
    });
  }

  navigateToProduct(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Computers': 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
      'Audio': 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      'Wearables': 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
      'Gaming': 'bg-error/20 text-error border-error/30',
      'Accessories': 'bg-success/20 text-success border-success/30',
      'Phone': 'bg-warning/20 text-warning border-warning/30'
    };
    return colors[category] || 'bg-bg-secondary/20 text-text-secondary border-border';
  }
}
