import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { ApiError } from '../api-client/api-client';

/**
 * Error Interceptor
 *
 * Unwraps the backend ApiResponse envelope and maps error codes to
 * user-friendly messages via `NotificationService`.
 *
 * Backend error format:
 * {
 *   success: false,
 *   error: { code: "AUTH_FAILED" | "INTERNAL_ERROR" | ..., message: "...", errors: {...} }
 * }
 */

const ERROR_CODE_MAP: Record<string, string> = {
  AUTH_FAILED: 'Authentication failed. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please fix the validation errors and try again.',
  DUPLICATE_EMAIL: 'This email address is already registered.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid session token.',
  INTERNAL_ERROR: 'A server error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again.',
  CONCURRENCY_CONFLICT: 'The data was modified by someone else. Please refresh.',
};

function resolveErrorMessage(error: HttpErrorResponse): string {
  // Unwrap API envelope error
  const body = error.error;

  if (body && !body.success && body.error) {
    const apiError: ApiError = body.error;

    // 1. Check our code map first
    if (apiError.code && ERROR_CODE_MAP[apiError.code]) {
      return ERROR_CODE_MAP[apiError.code];
    }

    // 2. Fall back to server message
    if (apiError.message) {
      return apiError.message;
    }
  }

  // Fallback: map by HTTP status
  switch (error.status) {
    case 400: return body?.message || 'Bad request. Please check your input.';
    case 401: return 'Unauthorized. Please log in again.';
    case 403: return 'Access denied. You do not have permission.';
    case 404: return body?.message || 'Resource not found.';
    case 409: return body?.message || 'Conflict – the resource already exists.';
    case 422: return body?.message || 'Unprocessable request.';
    case 500: return 'Server error. Please try again later.';
    case 503: return 'Service unavailable. Please try again later.';
    case 0: return 'Network error. Please check your connection.';
    default: return body?.message || `Unexpected error (${error.status}).`;
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 is handled by authInterceptor (refresh flow); don't double-notify
      if (error.status === 401) {
        return throwError(() => error);
      }

      if (error.error instanceof ErrorEvent) {
        // Client-side / network error
        notification.showError(`Network error: ${error.error.message}`);
      } else {
        const message = resolveErrorMessage(error);
        notification.showError(message);

        if (error.status === 403 && !router.url.includes('/login')) {
          router.navigate(['/unauthorized']);
        }
      }

      return throwError(() => error);
    })
  );
};
