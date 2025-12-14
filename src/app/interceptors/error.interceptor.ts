import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

/**
 * Global HTTP Error Interceptor
 * Handles all HTTP errors and provides user-friendly notifications
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            // Redirect to login if not already there
            if (!router.url.includes('/login')) {
              router.navigate(['/login']);
            }
            break;
          case 403:
            errorMessage = 'Access forbidden. You do not have permission.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 0:
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Show user-friendly error notification
      notificationService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};

