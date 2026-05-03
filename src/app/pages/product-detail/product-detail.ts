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
import { RatingComponent } from '../../components/ui/rating/rating.component';
import { SpinnerComponent } from '../../components/ui/spinner/spinner.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { 
  getProductById, 
  getReviewsByProductId, 
  Product, 
  Review 
} from '../../data/mock-data';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent,
    BadgeComponent,
    RatingComponent,
    SpinnerComponent,
    ModalComponent,
    InputComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
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
  activeTab = 'description';
  selectedVariant: any = null;
  showWishlistModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private wishlistService: WishlistService
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
    
    // Simulate API call delay
    setTimeout(() => {
      const product = getProductById(id);
      if (product) {
        this.product = product;
        this.loadReviews();
        this.loading = false;
      } else {
        this.error = 'Product not found';
        this.loading = false;
      }
    }, 500);
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
    
    // Simulate API call delay
    setTimeout(() => {
      this.reviews = getReviewsByProductId(this.product!.id);
      this.loadingReviews = false;
    }, 300);
  }

  submitReview(): void {
    if (!this.product) return;
    
    // Check if user is authenticated
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.notificationService.showError('Authentication required to publish review.');
        this.router.navigate(['/login']);
        return;
      }

      if (!this.newReview.title.trim() || !this.newReview.comment.trim()) {
        this.notificationService.showError('Required fields are missing.');
        return;
      }

      // Simulate adding review
      const newReview: Review = {
        id: Date.now(),
        productId: this.product!.id,
        userId: typeof user.id === 'number' ? user.id : 0,
        userName: user.email || 'Anonymous',
        rating: this.newReview.rating,
        title: this.newReview.title,
        comment: this.newReview.comment,
        date: new Date().toISOString(),
        helpful: 0,
        verified: false
      };

      this.reviews.unshift(newReview);
      this.notificationService.showSuccess('Review submitted successfully!');
      this.showReviewForm = false;
      this.newReview = { rating: 5, title: '', comment: '' };
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


