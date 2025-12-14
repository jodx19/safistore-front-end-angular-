
import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, delay } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

/**
 * Auth Interceptor
 * Adds JWT token to all outgoing requests
 * Handles token refresh on 401 response
 *
 * WORKFLOW:
 * 1. Get access token from storage
 * 2. Add to Authorization header
 * 3. If 401 response, try to refresh token
 * 4. Retry request with new token
 * 5. If refresh fails, redirect to login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip token for auth endpoints and external APIs
  const skipAuth =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    !req.url.includes(environment.apiUrl);

  if (skipAuth) {
    return next(req);
  }

  // Get current access token
  let token = authService.getAccessToken();

  // Clone request and add Authorization header
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          // Try to refresh token
          return authService.refreshToken(refreshToken).pipe(
            // Retry original request with new token
            switchMap((response: any) => {
              const newAccessToken = response.accessToken;

              // Update stored token
              authService.setAccessToken(newAccessToken);

              // Retry request with new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // Refresh failed - logout user
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // No refresh token - logout
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => error);
        }
      }

      return throwError(() => error);
    })
  );
};