import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { ReviewService, Review } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EmptyStateComponent,
    RevealDirective,
    ButtonComponent,
    BadgeComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);

  product: Product | null = null;
  loading = true;
  error = '';
  selectedImageIndex = 0;
  quantity = 1;
  reviews: Review[] = [];
  showReviewForm = false;
  newReview = {
    rating: 5,
    title: '',
    comment: ''
  };
  loadingReviews = false;

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
      next: (data: any) => {
        this.product = {
          id: data.id,
          title: data.title,
          price: data.price,
          description: data.description,
          imageUrl: data.imageUrl,
          rating: data.rating ?? 0,
          stock: data.stock ?? 0,
          categoryName: data.categoryName,
          categoryId: data.categoryId ?? 0
        };
        this.loadReviews();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to retrieve product data from the secure server.';
        this.loading = false;
      }
    });
  }

  getProductImages(): string[] {
    return this.product?.imageUrl ? [this.product.imageUrl] : [];
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
    const success = this.cartService.addToCart(this.product, this.quantity);
    if (success) {
      this.notificationService.showSuccess(`${this.quantity} units added to your acquisition log.`);
    } else {
      this.notificationService.showError('Acquisition failed. Check local storage capacity.');
    }
  }

  private loadReviews(): void {
    if (!this.product) return;
    this.loadingReviews = true;
    this.reviewService.getReviews(this.product.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews as any; // Cast for now to match local Review structure
        this.loadingReviews = false;
      },
      error: () => {
        this.loadingReviews = false;
      }
    });
  }

  submitReview(): void {
    if (!this.product) return;
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.notificationService.showError('Authentication required to publish analysis.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.newReview.title.trim() || !this.newReview.comment.trim()) {
      this.notificationService.showError('Required fields are missing.');
      return;
    }

    this.reviewService.addReview({
      productId: this.product.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    }).subscribe({
      next: (review) => {
        this.reviews.unshift(review as any);
        this.notificationService.showSuccess('Analysis log updated successfully.');
        this.showReviewForm = false;
        this.newReview = { rating: 5, title: '', comment: '' };
      },
      error: (error) => {
        this.notificationService.showError(error.message || 'Transmission error.');
      }
    });
  }

  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('Authentication required.');
      this.router.navigate(['/login']);
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}


