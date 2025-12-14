import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { OrderReviewComponent } from './order-review';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';

describe('OrderReviewComponent', () => {
  let component: OrderReviewComponent;
  let fixture: ComponentFixture<OrderReviewComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let authService: jasmine.SpyObj<AuthService>;
  let orderService: jasmine.SpyObj<OrderService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockCartItems = [
    {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      image: 'test.jpg',
      quantity: 2
    }
  ];

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user' as const
  };

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCartTotal', 'clearCart'], {
      cartItems$: new BehaviorSubject(mockCartItems)
    });
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser'], {
      currentUser$: new BehaviorSubject(mockUser)
    });
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError', 'showWarning']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    cartServiceSpy.getCartTotal.and.returnValue({
      subtotal: 199.98,
      tax: 19.998,
      shipping: 10,
      total: 229.978
    });
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [OrderReviewComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(OrderReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    fixture.detectChanges();
    expect(component.cartItems.length).toBe(1);
    expect(component.cartTotal.subtotal).toBe(199.98);
  });

  it('should redirect to products if cart is empty', (done) => {
    cartService.cartItems$ = new BehaviorSubject([]);
    fixture = TestBed.createComponent(OrderReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    setTimeout(() => {
      expect(notificationService.showWarning).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
      done();
    }, 2500);
  });

  it('should confirm order successfully', () => {
    const mockOrder = {
      id: 'ORD-123',
      customerId: '1',
      items: [],
      total: 229.978,
      shippingAddress: {} as any,
      paymentInfo: {} as any,
      status: 'pending' as const
    };

    orderService.createOrder.and.returnValue(of(mockOrder));
    component.cartItems = mockCartItems;
    fixture.detectChanges();

    component.confirmOrder();

    expect(orderService.createOrder).toHaveBeenCalled();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalled();
  });

  it('should handle order creation error', () => {
    orderService.createOrder.and.returnValue(throwError(() => new Error('Failed')));
    component.cartItems = mockCartItems;
    fixture.detectChanges();

    component.confirmOrder();

    expect(notificationService.showError).toHaveBeenCalled();
  });
});

