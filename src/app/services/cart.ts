import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "./notification.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

export interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  quantity: number;
  priceAtAddition: number;
  totalPrice: number;
  /** Alias for templates using `item.image` */
  image?: string;
  /** Alias for templates using `item.name` */
  name?: string;
  /** Alias for templates using `item.price` (unit price) */
  price?: number;
}

interface BackendCartItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  quantity: number;
  priceAtAddition: number;
  totalPrice: number;
}

interface CartResponse {
  items: BackendCartItem[];
  total: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  private cartTotal = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotal.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    // Load cart when user logs in
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadCartFromBackend();
      } else {
        // Clear cart when user logs out
        this.cartItems.next([]);
        this.cartTotal.next(0);
      }
    });
  }

  /**
   * Load cart from backend API
   */
  private loadCartFromBackend(): void {
    if (!this.authService.isAuthenticated()) {
      this.cartItems.next([]);
      this.cartTotal.next(0);
      return;
    }

    this.isLoading.next(true);
    this.http.get<{ success: boolean; data: CartResponse }>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Failed to load cart:', error);
          this.notificationService.showError('⚠️ Failed to load cart. Please refresh the page.');
          return of({ success: false, data: { items: [], total: 0 } });
        })
      )
      .subscribe((response) => {
        if (response?.success && response.data?.items) {
          const mappedItems: CartItem[] = response.data.items.map(item => ({
            id: item.id,
            productId: item.productId,
            productTitle: item.productTitle,
            productImage: item.productImage,
            quantity: item.quantity,
            priceAtAddition: item.priceAtAddition,
            totalPrice: item.totalPrice,
            image: item.productImage,
            name: item.productTitle,
            price: item.priceAtAddition
          }));
          this.cartItems.next(mappedItems);
          this.cartTotal.next(response.data.total);
        } else {
          this.cartItems.next([]);
          this.cartTotal.next(0);
        }
        this.isLoading.next(false);
      });
  }

  /**
   * Adds a product to cart with backend API call.
   * If user is NOT logged in -> redirect to /login and do NOT add.
   * @param product - Product to add to cart
   * @param quantity - Quantity to add (default: 1)
   * @returns Observable<boolean> - true if added successfully, false otherwise
   */
  addToCart(product: any, quantity: number = 1): Observable<boolean> {
    // 1) Prevent adding if user not logged in
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showWarning('🔐 Please log in to add items to cart.');
      this.router.navigate(["/login"]);
      return of(false);
    }

    const productId = Number(product?.id);
    if (!productId || productId <= 0) {
      this.notificationService.showError('❌ Invalid product.');
      return of(false);
    }

    this.isLoading.next(true);

    const payload = {
      productId: productId,
      quantity: quantity
    };

    return this.http.post<{ success: boolean; data: BackendCartItem }>(
      `${this.apiUrl}/items`,
      payload
    ).pipe(
      tap((response) => {
        if (response?.success && response.data) {
          // Reload cart from backend to get updated state
          this.loadCartFromBackend();
          this.notificationService.showSuccess(
            `✅ ${product?.title || product?.name || 'Product'} added to cart`
          );
        }
        this.isLoading.next(false);
      }),
      map((response) => response?.success ?? false),
      catchError((error) => {
        console.error('Failed to add to cart:', error);
        const message = error?.error?.message || error?.error?.error?.message || 'Failed to add item to cart';
        this.notificationService.showError(`❌ ${message}`);
        this.isLoading.next(false);
        return of(false);
      })
    );
  }

  /**
   * Remove item from cart via backend API
   */
  removeFromCart(cartItemId: number): void {
    this.isLoading.next(true);
    
    this.http.delete<{ success: boolean }>(`${this.apiUrl}/items/${cartItemId}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to remove item:', error);
          this.notificationService.showError('❌ Failed to remove item from cart.');
          this.isLoading.next(false);
          return of({ success: false });
        })
      )
      .subscribe((response) => {
        if (response?.success) {
          // Reload cart from backend
          this.loadCartFromBackend();
          this.notificationService.showSuccess('✅ Item removed from cart');
        }
        this.isLoading.next(false);
      });
  }

  /**
   * Update item quantity via backend API
   */
  updateQuantity(cartItemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    this.isLoading.next(true);
    
    this.http.put<{ success: boolean; data: BackendCartItem }>(
      `${this.apiUrl}/items/${cartItemId}`,
      { quantity: Math.floor(quantity) }
    ).pipe(
      catchError((error) => {
        console.error('Failed to update quantity:', error);
        const message = error?.error?.message || error?.error?.error?.message || 'Failed to update quantity';
        this.notificationService.showError(`❌ ${message}`);
        this.isLoading.next(false);
        return of({ success: false, data: null });
      })
    ).subscribe((response) => {
      if (response?.success) {
        this.loadCartFromBackend();
      }
      this.isLoading.next(false);
    });
  }

  /**
   * Clear cart via backend API
   */
  clearCart(): void {
    this.isLoading.next(true);
    
    this.http.delete<{ success: boolean }>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Failed to clear cart:', error);
          this.notificationService.showError('❌ Failed to clear cart.');
          this.isLoading.next(false);
          return of({ success: false });
        })
      )
      .subscribe((response) => {
        if (response?.success) {
          this.cartItems.next([]);
          this.cartTotal.next(0);
          this.notificationService.showSuccess('✅ Cart cleared');
        }
        this.isLoading.next(false);
      });
  }

  // ---------- Helpers / selectors ----------

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((s, i) => s + i.quantity, 0);
  }

  getCartTotal(): { subtotal: number; shipping: number; tax: number; total: number } {
    const subtotal = this.cartTotal.value;
    const tax = +(subtotal * 0.10).toFixed(2); // 10% VAT
    const shipping = subtotal > 0 ? 10 : 0;
    const total = +(subtotal + tax + shipping).toFixed(2);
    return { subtotal: +subtotal.toFixed(2), shipping, tax, total };
  }
}
