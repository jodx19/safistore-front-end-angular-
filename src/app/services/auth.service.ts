import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthClient, ApiResponse, AuthResponseDto, LoginRequestDto, RegisterRequestDto, RefreshTokenRequestDto } from '../api-client/api-client';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from './notification.service';

/**
 * Backward-compat type alias so components importing `User` still compile.
 * Use `CurrentUser` for new code.
 */
export type User = CurrentUser;

export interface CurrentUser {
  userId: string;
  /** @deprecated Use `userId` (string). Only here for backward compatibility. */
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiresAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser$ = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this._currentUser$.asObservable();

  constructor(
    private authClient: AuthClient,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.restoreSession();
  }

  // ─── Session Restoration ──────────────────────────────────────────────────

  private restoreSession(): void {
    const user = this.tokenStorage.getUser();
    if (user && this.tokenStorage.isAuthenticated()) {
      this._currentUser$.next(user);
    } else {
      this.tokenStorage.clear();
    }
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  register(dto: RegisterRequestDto): Observable<AuthResponseDto> {
    return this.authClient.register(dto).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  login(dto: LoginRequestDto): Observable<AuthResponseDto> {
    return this.authClient.login(dto).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  refreshToken(dto: RefreshTokenRequestDto): Observable<AuthResponseDto> {
    return this.authClient.refreshToken(dto).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  logout(): void {
    // Fire-and-forget server-side logout (revoke refresh token)
    this.authClient.logout().subscribe({ error: () => { } });
    this.clearSession();
    this.router.navigate(['/login']);
  }

  logoutAll(): void {
    // TODO: Implement logout all devices backend endpoint
    // For now, just do regular logout
    this.notificationService.showWarning('Logout all devices feature coming soon');
    this.logout();
  }

  private clearSession(): void {
    this.tokenStorage.clear();
    this._currentUser$.next(null);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

   private handleAuthSuccess(data: AuthResponseDto): void {
    if (data.accessToken && data.refreshToken) {
      this.tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    }
    
    if (data.user) {
      const user: CurrentUser = {
        userId: data.user.id.toString(),
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.roles[0] || 'Customer',
        expiresAt: data.accessTokenExpiry
      };
      this.tokenStorage.saveUser(user);
      this._currentUser$.next(user);
    }
  }

  get currentUser(): CurrentUser | null {
    return this._currentUser$.getValue();
  }

  /** @deprecated Use the `currentUser` getter instead */
  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  /**
   * @deprecated Admin management should be done via a dedicated Admin API endpoint.
   * This stub is here for backward compatibility only.
   */
  addNewAdmin(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return throwError(() => new Error('addNewAdmin: use the Admin API endpoint instead.'));
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.isAuthenticated();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.currentUser?.role?.toLowerCase() === 'admin';
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.tokenStorage.getRefreshToken();
  }

  setAccessToken(token: string): void {
    const refresh = this.tokenStorage.getRefreshToken() ?? '';
    this.tokenStorage.saveTokens(token, refresh);
  }

  /**
   * Update current user data in session
   */
  updateCurrentUser(user: CurrentUser): void {
    this.tokenStorage.saveUser(user);
    this._currentUser$.next(user);
  }
}
