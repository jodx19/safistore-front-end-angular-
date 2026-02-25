import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { ReviewService, Review } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

/**
 * Product Detail Component
 * Displays full product information with gallery, reviews, and add to cart functionality
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error = '';
  selectedImageIndex = 0;
  quantity = 1;
  breadcrumbItems: BreadcrumbItem[] = [];
  reviews: Review[] = [];
  showReviewForm = false;
  newReview = {
    rating: 5,
    title: '',
    comment: ''
  };
  loadingReviews = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
      this.error = 'Product ID not found';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load product details by ID
   */
  private loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.product = {
            id: data.id,
            title: data.title,
            price: data.price,
            description: data.description,
            image: data.image,
            rating: data.rating?.rate ?? 0,
            stock: data.stock ?? 0,
            category: data.category
          };
          this.setupBreadcrumbs();
          this.loadReviews();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details';
          this.loading = false;
        }
      });
  }

  /**
   * Setup breadcrumb navigation
   */
  private setupBreadcrumbs(): void {
    if (this.product) {
      this.breadcrumbItems = [
        { label: 'Home', route: '/' },
        { label: 'Products', route: '/products' },
        { label: this.product.title }
      ];
    }
  }

  /**
   * Get product images (for gallery - using single image for now)
   */
  getProductImages(): string[] {
    if (!this.product) return [];
    // In a real app, this would come from product.images array
    return [this.product.image];
  }

  /**
   * Select image in gallery
   */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  /**
   * Update quantity
   */
  updateQuantity(change: number): void {
    if (!this.product) return;
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
    }
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    if (!this.product) return;

    for (let i = 0; i < this.quantity; i++) {
      const success = this.cartService.addToCart(this.product, this.product.stock);
      if (!success) {
        this.notificationService.showError(
          `Cannot add ${this.quantity} items. Only ${this.product.stock} available.`
        );
        return;
      }
    }

    this.notificationService.showSuccess(
      `${this.quantity} x ${this.product.title} added to cart!`
    );
  }

  /**
   * Get rating stars array
   */
  getRatingStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars;
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/600x600?text=No+Image';
  }

  /**
   * Navigate to products page
   */
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  /**
   * Load reviews for the product
   */
  private loadReviews(): void {
    if (!this.product) return;

    this.loadingReviews = true;
    this.reviewService.getReviews(this.product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.loadingReviews = false;
        },
        error: (error) => {
          this.loadingReviews = false;
        }
      });
  }

  /**
   * Submit a new review
   */
  submitReview(): void {
    if (!this.product) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.notificationService.showError('Please log in to submit a review');
      this.router.navigate(['/login']);
      return;
    }

    // Validate form
    if (!this.newReview.title.trim() || !this.newReview.comment.trim()) {
      this.notificationService.showError('Please fill in all fields');
      return;
    }

    if (this.newReview.comment.trim().length < 10) {
      this.notificationService.showError('Comment must be at least 10 characters');
      return;
    }

    this.reviewService.addReview(this.product.id, {
      userId: user.id?.toString() || user.email,
      userName: `${user.firstName} ${user.lastName}`,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.notificationService.showSuccess('Review submitted successfully!');
          this.showReviewForm = false;
          this.newReview = { rating: 5, title: '', comment: '' };
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Failed to submit review');
        }
      });
  }

  /**
   * Toggle review form
   */
  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('Please log in to write a review');
      this.router.navigate(['/login']);
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  /**
   * Mark review as helpful
   */
  markHelpful(review: Review): void {
    if (!this.product) return;

    this.reviewService.markHelpful(this.product.id, review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedReview: Review) => {
          const index = this.reviews.findIndex(r => r.id === review.id);
          if (index !== -1) {
            this.reviews[index] = updatedReview;
          }
          this.notificationService.showSuccess('Thank you for your feedback!');
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to update review');
        }
      });
  }
}

