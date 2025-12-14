import { TestBed } from '@angular/core/testing';
import { ReviewService, Review } from './review.service';
import { of, throwError } from 'rxjs';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array when no reviews exist', (done) => {
    service.getReviews(1).subscribe({
      next: (reviews) => {
        expect(reviews).toEqual([]);
        done();
      }
    });
  });

  it('should add and retrieve reviews', (done) => {
    const reviewData = {
      userId: 'user1',
      userName: 'Test User',
      rating: 5,
      title: 'Great product',
      comment: 'This is an excellent product that I highly recommend.'
    };

    service.addReview(1, reviewData).subscribe({
      next: (review) => {
        expect(review.productId).toBe(1);
        expect(review.rating).toBe(5);
        expect(review.title).toBe('Great product');

        // Retrieve reviews
        service.getReviews(1).subscribe({
          next: (reviews) => {
            expect(reviews.length).toBe(1);
            expect(reviews[0].title).toBe('Great product');
            done();
          }
        });
      }
    });
  });

  it('should validate rating range', (done) => {
    const invalidReview = {
      userId: 'user1',
      userName: 'Test User',
      rating: 6, // Invalid
      title: 'Test',
      comment: 'This is a test comment with enough characters.'
    };

    service.addReview(1, invalidReview).subscribe({
      error: (error) => {
        expect(error.message).toContain('Rating must be between 1 and 5');
        done();
      }
    });
  });

  it('should validate comment length', (done) => {
    const invalidReview = {
      userId: 'user1',
      userName: 'Test User',
      rating: 5,
      title: 'Test',
      comment: 'Short' // Too short
    };

    service.addReview(1, invalidReview).subscribe({
      error: (error) => {
        expect(error.message).toContain('at least 10 characters');
        done();
      }
    });
  });

  it('should mark review as helpful', (done) => {
    const reviewData = {
      userId: 'user1',
      userName: 'Test User',
      rating: 5,
      title: 'Great product',
      comment: 'This is an excellent product that I highly recommend.'
    };

    service.addReview(1, reviewData).subscribe({
      next: (review) => {
        service.markHelpful(1, review.id).subscribe({
          next: (updatedReview) => {
            expect(updatedReview.helpful).toBe(1);
            done();
          }
        });
      }
    });
  });
});

