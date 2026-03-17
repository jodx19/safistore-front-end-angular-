import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReviewClient, ReviewDto, AddReviewDto, UpdateReviewDto } from '../api-client/api-client';

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private reviewClient: ReviewClient) { }

  private handleError(error: any): Observable<never> {
    const message = error?.error?.message ?? error?.message ?? 'Failed to process review';
    return throwError(() => new Error(message));
  }

  getReviews(productId: number): Observable<ReviewDto[]> {
    return this.reviewClient.getByProduct(productId).pipe(
      map(res => res.data ?? []),
      catchError(err => this.handleError(err))
    );
  }

  addReview(dto: AddReviewDto): Observable<ReviewDto> {
    return this.reviewClient.add(dto).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  updateReview(id: number, dto: UpdateReviewDto): Observable<ReviewDto> {
    return this.reviewClient.update(id, dto).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.reviewClient.delete(id).pipe(
      map(() => {}),
      catchError(err => this.handleError(err))
    );
  }

  getAverageRating(productId: number): Observable<number> {
    return this.reviewClient.getProductSummary(productId).pipe(
      map(res => res.data?.averageRating ?? 0),
      catchError(() => of(0))
    );
  }
}

