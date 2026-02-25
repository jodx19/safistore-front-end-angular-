import { HttpInterceptorFn, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiResponse, AuthResponseDto } from '../api-client/api-client';

/**
 * Auth Interceptor (functional, Angular 14+)
 *
 * 1. Attaches `Authorization: Bearer <token>` to all API requests.
 * 2. On 401: attempts a single token refresh.
 * 3. If refresh succeeds → retries original request with new token.
 * 4. If refresh fails → clears session and navigates to /login.
 *
 * Public endpoints (login, register, refresh-token) skip the bearer header.
 */

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<string | null>(null);

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token'];

function isApiUrl(url: string): boolean {
  return url.startsWith(environment.apiUrl);
}

function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some(ep => url.includes(ep));
}

function cloneWithToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const http = inject(HttpClient);

  // Skip non-API requests and public auth routes
  if (!isApiUrl(req.url) || isPublicEndpoint(req.url)) {
    return next(req);
  }

  const token = tokenStorage.getAccessToken();
  const authReq = token ? cloneWithToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      const currentAccess = tokenStorage.getAccessToken();

      if (!refreshToken || !currentAccess) {
        tokenStorage.clear();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return refreshDone$.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap(newToken => next(cloneWithToken(req, newToken)))
        );
      }

      isRefreshing = true;
      refreshDone$.next(null);

      return http
        .post<ApiResponse<AuthResponseDto>>(`${environment.apiUrl}/auth/refresh-token`, {
          accessToken: currentAccess,
          refreshToken: refreshToken
        })
        .pipe(
          switchMap((response: ApiResponse<AuthResponseDto>) => {
            isRefreshing = false;
            const newAccess = response?.data?.accessToken;
            const newRefresh = response?.data?.refreshToken ?? refreshToken;

            if (!newAccess) {
              tokenStorage.clear();
              router.navigate(['/login']);
              return throwError(() => new Error('Refresh response missing token'));
            }

            tokenStorage.saveTokens(newAccess, newRefresh);
            refreshDone$.next(newAccess);

            return next(cloneWithToken(req, newAccess));
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            refreshDone$.next(null);
            tokenStorage.clear();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
    })
  );
};
