import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductDetailComponent } from './product-detail';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    description: 'Test description',
    image: 'test.jpg',
    rating: 4.5,
    stock: 10,
    category: 'electronics'
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? '1' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    productService.getProductById.and.returnValue(of(mockProduct));
    fixture.detectChanges();

    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product).toBeTruthy();
    expect(component.product?.title).toBe('Test Product');
  });

  it('should handle product load error', () => {
    productService.getProductById.and.returnValue(throwError(() => new Error('Not found')));
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load product details');
    expect(component.loading).toBe(false);
  });

  it('should update quantity correctly', () => {
    component.product = mockProduct;
    component.quantity = 1;

    component.updateQuantity(1);
    expect(component.quantity).toBe(2);

    component.updateQuantity(-1);
    expect(component.quantity).toBe(1);
  });

  it('should not exceed stock when updating quantity', () => {
    component.product = mockProduct;
    component.quantity = 10;

    component.updateQuantity(1);
    expect(component.quantity).toBe(10); // Should not exceed stock
  });

  it('should add product to cart', () => {
    component.product = mockProduct;
    component.quantity = 2;
    cartService.addToCart.and.returnValue(true);

    component.addToCart();

    expect(cartService.addToCart).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalled();
  });

  it('should get rating stars correctly', () => {
    const stars = component.getRatingStars(4.5);
    expect(stars.length).toBe(5);
    expect(stars.filter(s => s === '★').length).toBe(4);
  });
});

