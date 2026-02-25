import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Review interface
 */
export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  helpful?: number;
}

/**
 * Review Service
 * Handles product reviews with mock adapter using localStorage
 * In production, this would connect to a backend API
 * 
 * Storage: Uses localStorage with key pattern: reviews_<productId>
 */
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly STORAGE_KEY_PREFIX = 'reviews_';

  constructor() { }

  /**
   * Get storage key for product reviews
   */
  private getStorageKey(productId: number): string {
    return `${this.STORAGE_KEY_PREFIX}${productId}`;
  }

  /**
   * Get all reviews for a product
   * @param productId - Product ID
   * @returns Observable of reviews array
   */
  getReviews(productId: number): Observable<Review[]> {
    try {
      const storageKey = this.getStorageKey(productId);
      const saved = localStorage.getItem(storageKey);

      if (!saved) {
        return of([]).pipe(delay(300)); // Simulate network delay
      }

      const reviews: Review[] = JSON.parse(saved).map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt)
      }));

      return of(reviews).pipe(delay(300));
    } catch {
      return throwError(() => new Error('Failed to load reviews'));
    }
  }

  /**
   * Add a new review
   * @param productId - Product ID
   * @param review - Review data (without id and createdAt)
   * @returns Observable of created review
   */
  addReview(productId: number, review: Omit<Review, 'id' | 'productId' | 'createdAt'>): Observable<Review> {
    try {
      // Validate review data
      if (!review.rating || review.rating < 1 || review.rating > 5) {
        return throwError(() => new Error('Rating must be between 1 and 5'));
      }

      if (!review.comment || review.comment.trim().length < 10) {
        return throwError(() => new Error('Comment must be at least 10 characters'));
      }

      // Get existing reviews
      const storageKey = this.getStorageKey(productId);
      const saved = localStorage.getItem(storageKey);
      const existingReviews: Review[] = saved ? JSON.parse(saved) : [];

      // Create new review
      const newReview: Review = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        ...review,
        createdAt: new Date(),
        helpful: 0
      };

      // Add to array and save
      existingReviews.push(newReview);
      localStorage.setItem(storageKey, JSON.stringify(existingReviews));

      return of(newReview).pipe(delay(500)); // Simulate network delay
    } catch {
      return throwError(() => new Error('Failed to add review'));
    }
  }

  /**
   * Mark review as helpful
   * @param productId - Product ID
   * @param reviewId - Review ID
   * @returns Observable of updated review
   */
  markHelpful(productId: number, reviewId: string): Observable<Review> {
    try {
      const storageKey = this.getStorageKey(productId);
      const saved = localStorage.getItem(storageKey);

      if (!saved) {
        return throwError(() => new Error('Reviews not found'));
      }

      const reviews: Review[] = JSON.parse(saved);
      const reviewIndex = reviews.findIndex(r => r.id === reviewId);

      if (reviewIndex === -1) {
        return throwError(() => new Error('Review not found'));
      }

      reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1;
      localStorage.setItem(storageKey, JSON.stringify(reviews));

      return of(reviews[reviewIndex]).pipe(delay(300));
    } catch {
      return throwError(() => new Error('Failed to update review'));
    }
  }

  /**
   * Get average rating for a product
   * @param productId - Product ID
   * @returns Observable of average rating
   */
  getAverageRating(productId: number): Observable<number> {
    return new Observable(observer => {
      this.getReviews(productId).subscribe({
        next: (reviews) => {
          if (reviews.length === 0) {
            observer.next(0);
            observer.complete();
            return;
          }
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          const average = sum / reviews.length;
          observer.next(Math.round(average * 10) / 10); // Round to 1 decimal
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}

