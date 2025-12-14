import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user' as const
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getCurrentUser'], {
      currentUser$: new BehaviorSubject(mockUser)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(CartService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      image: 'test.jpg',
      stock: 10
    };

    const result = service.addToCart(product, product.stock);
    expect(result).toBe(true);

    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(1);
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should not add product if stock is insufficient', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      image: 'test.jpg',
      stock: 0
    };

    const result = service.addToCart(product, product.stock);
    expect(result).toBe(false);

    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should update quantity correctly', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      image: 'test.jpg',
      stock: 10
    };

    service.addToCart(product, product.stock);
    service.updateQuantity(1, 3);

    service.cartItems$.subscribe(items => {
      expect(items[0].quantity).toBe(3);
    });
  });

  it('should remove item from cart', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      image: 'test.jpg',
      stock: 10
    };

    service.addToCart(product, product.stock);
    service.removeFromCart(1);

    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should calculate cart total correctly', () => {
    const product1 = { id: 1, title: 'Product 1', price: 10, image: 'test.jpg', stock: 10 };
    const product2 = { id: 2, title: 'Product 2', price: 20, image: 'test.jpg', stock: 10 };

    service.addToCart(product1, product1.stock);
    service.addToCart(product2, product2.stock);

    const total = service.getCartTotal();
    expect(total.subtotal).toBe(30);
    expect(total.tax).toBe(3);
    expect(total.shipping).toBe(10);
    expect(total.total).toBe(43);
  });

  it('should use user-specific storage', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      image: 'test.jpg',
      stock: 10
    };

    service.addToCart(product, product.stock);

    // Check that storage key includes user ID
    const storageKey = `cart_${mockUser.id}`;
    const saved = localStorage.getItem(storageKey);
    expect(saved).toBeTruthy();
  });
});
