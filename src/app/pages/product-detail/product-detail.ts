import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { ProductService } from '../../services/product';
import { ReviewClient } from '../../api-client/api-client';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent,
    BadgeComponent,
    RevealDirective
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  error = '';
  selectedImageIndex = 0;
  quantity = 1;
  reviews: any[] = [];
  showReviewForm = false;
  newReview = {
    rating: 5,
    title: '',
    comment: ''
  };
  loadingReviews = false;
  activeTab = 'description';
  selectedVariant: any = null;
  showWishlistModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private reviewClient: ReviewClient
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
      this.error = 'Product identification failed';
      this.loading = false;
    }
  }

  private loadProduct(id: number): void {
    this.loading = true;

    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        const product = response?.data ?? response;
        if (product && product.id) {
          this.product = {
            id: product.id,
            title: product.title || product.name,
            name: product.name || product.title,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.categoryName || product.category || '',
            imageUrl: product.imageUrl,
            image: product.imageUrl || product.image || null,
            thumbnail: product.imageUrl || product.thumbnail || null,
            images: product.images || [product.imageUrl].filter(Boolean),
            rating: product.rating || 0,
            comparePrice: product.comparePrice,
            isNew: !!product.isNew,
            isSale: !!product.isSale,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          };
          this.loadReviews();
        } else {
          this.error = 'Product not found';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load product';
        this.loading = false;
      }
    });
  }

  getProductImages(): string[] {
    return this.product?.images || [];
  }

  get currentImage(): string {
    const images = this.getProductImages();
    return images[this.selectedImageIndex] || images[0] || '';
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  get isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.isInWishlist(this.product.id);
  }

  toggleWishlist(): void {
    if (!this.product) return;
    this.wishlistService.toggleWishlist(this.product).subscribe({
      next: (success) => {
        if (success) {
          const message = this.isInWishlist ? 
            `${this.product!.name} added to wishlist` : 
            `${this.product!.name} removed from wishlist`;
          this.notificationService.showSuccess(message);
        }
      }
    });
  }

  updateQuantity(change: number): void {
    if (!this.product) return;
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= (this.product.stock || 99)) {
      this.quantity = newQuantity;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.showSuccess(`${this.quantity} unit(s) added to cart.`);
        }
      },
      error: (error) => {
        console.error('Add to cart failed:', error);
        this.notificationService.showError('Failed to add item to cart.');
      }
    });
  }

  private loadReviews(): void {
    if (!this.product) return;
    this.loadingReviews = true;

    this.reviewClient.getByProduct(this.product.id).subscribe({
      next: (response: any) => {
        const items = response?.data || [];
        this.reviews = Array.isArray(items) ? items : [];
        this.loadingReviews = false;
      },
      error: () => {
        this.reviews = [];
        this.loadingReviews = false;
      }
    });
  }

  submitReview(): void {
    if (!this.product) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.notificationService.showError('Authentication required to publish review.');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.newReview.title.trim() || !this.newReview.comment.trim()) {
      this.notificationService.showError('Required fields are missing.');
      return;
    }

    this.reviewClient.add({
      productId: this.product.id,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment
    } as any).subscribe({
      next: () => {
        this.notificationService.showSuccess('Review submitted successfully!');
        this.showReviewForm = false;
        this.newReview = { rating: 5, title: '', comment: '' };
        this.loadReviews();
      },
      error: (err: any) => {
        this.notificationService.showError(err?.error?.message || 'Failed to submit review');
      }
    });
  }

  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('Authentication required.');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}


