import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SearchResultsComponent } from './search-results';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockProducts = [
    {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      image: 'test.jpg',
      rating: 4.5,
      stock: 10,
      category: 'electronics'
    }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getAllProducts', 'getCategories']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError', 'showWarning']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productServiceSpy.getAllProducts.and.returnValue(of(mockProducts));
    productServiceSpy.getCategories.and.returnValue(of(['electronics', 'clothing']));
    cartServiceSpy.addToCart.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ q: 'test' })
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debounce search input', fakeAsync(() => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#search-input');
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    tick(200); // Less than debounce time
    expect(component.searchQuery).toBe('test'); // Should still be old value
    
    tick(200); // Complete debounce
    expect(component.searchQuery).toBe('test');
  }));

  it('should filter products by search query', () => {
    component.products = mockProducts;
    component.searchQuery = 'Test';
    component.applyFilters();
    
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should filter products by category', () => {
    component.products = mockProducts;
    component.selectedCategory = 'electronics';
    component.applyFilters();
    
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should sort products by price ascending', () => {
    component.products = [
      { ...mockProducts[0], price: 100 },
      { ...mockProducts[0], id: 2, price: 50 }
    ];
    component.sortBy = 'price-asc';
    component.applyFilters();
    
    expect(component.filteredProducts[0].price).toBe(50);
  });
});

