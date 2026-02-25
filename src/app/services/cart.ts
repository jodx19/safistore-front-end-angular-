import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service"; // عدّل المسار إذا كان مختلفاً

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly STORAGE_KEY_PREFIX = "cart_";

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor(private authService: AuthService, private router: Router) {
    // Subscribe to auth changes to load user-specific cart
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadCartFromStorage();
      } else {
        // Clear cart when user logs out
        this.cartItems.next([]);
      }
    });
  }

  /**
   * Get storage key for current user's cart
   */
  private getStorageKey(): string {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || 'guest';
    return `${this.STORAGE_KEY_PREFIX}${userId}`;
  }

  /**
   * Adds a product to cart with stock validation.
   * If user is NOT logged in -> redirect to /login and do NOT add.
   * Keeps immutability (create new array) to avoid in-place mutations.
   * @param product - Product to add to cart
   * @param availableStock - Available stock quantity (optional, for validation)
   * @returns true if added successfully, false otherwise
   */
  addToCart(product: any, availableStock?: number): boolean {
    // 1) prevent adding if user not logged in
    if (!this.authService.isLoggedIn()) {
      // optionally show a toast/message in component instead of redirecting
      // but here we redirect to login to enforce auth before cart operations.
      this.router.navigate(["/login"]);
      return false;
    }

    // 2) normalize incoming product fields (fallbacks)
    const productId = Number(product?.id);
    const productName = product?.title || product?.name || "Product";
    const productPrice = Number(product?.price) || 0;
    const productImage = product?.image || product?.thumbnail || "";

    // 3) work on a new array (avoid mutating BehaviorSubject.value directly)
    const items = [...this.cartItems.value];
    const idx = items.findIndex((i) => i.id === productId);

    if (idx !== -1) {
      // Check stock before increasing quantity
      const newQuantity = items[idx].quantity + 1;
      if (availableStock !== undefined && newQuantity > availableStock) {
        return false; // Stock limit reached
      }
      // increase quantity (cap sanity at 99 or available stock)
      const maxQuantity = availableStock !== undefined ? Math.min(99, availableStock) : 99;
      const updatedItem = { ...items[idx], quantity: Math.min(newQuantity, maxQuantity) };
      items[idx] = updatedItem;
    } else {
      // Check stock for new item
      if (availableStock !== undefined && availableStock < 1) {
        return false; // Out of stock
      }
      const cartItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      };
      items.push(cartItem);
    }

    this.cartItems.next(items);
    this.saveCartToStorage();
    return true;
  }

  removeFromCart(itemId: number): void {
    const items = this.cartItems.value.filter((item) => item.id !== itemId);
    this.cartItems.next(items);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      // remove item if set to 0
      this.removeFromCart(itemId);
      return;
    }

    const items = [...this.cartItems.value];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx !== -1) {
      const updated = { ...items[idx], quantity: Math.floor(quantity) };
      items[idx] = updated;
      this.cartItems.next(items);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  // ---------- Helpers / selectors ----------

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((s, i) => s + i.quantity, 0);
  }

  getCartTotal(): { subtotal: number; shipping: number; tax: number; total: number } {
    const subtotal = this.cartItems.value.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const tax = +(subtotal * 0.10).toFixed(2); // 10% VAT (example)
    const shipping = subtotal > 0 ? 10 : 0;
    const total = +(subtotal + tax + shipping).toFixed(2);
    return { subtotal: +subtotal.toFixed(2), shipping, tax, total };
  }

  // ---------- Storage persistence ----------

  private saveCartToStorage(): void {
    try {
      const storageKey = this.getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(this.cartItems.value));
    } catch {
      // Storage unavailable — cart will not persist this session
    }
  }

  private loadCartFromStorage(): void {
    try {
      const storageKey = this.getStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        this.cartItems.next([]);
        return;
      }

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        this.cartItems.next([]);
        return;
      }

      // basic validation of each item
      const items: CartItem[] = parsed
        .map((it: any) => ({
          id: Number(it.id) || 0,
          name: it.name || "Product",
          price: Number(it.price) || 0,
          image: it.image || "",
          quantity: Math.max(1, Math.floor(it.quantity || 1)),
        }))
        .filter((it) => it.id > 0);

      this.cartItems.next(items);
    } catch {
      this.cartItems.next([]);
    }
  }
}
