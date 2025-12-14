import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbsComponent, BreadcrumbItem } from './breadcrumbs';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render breadcrumb items', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', route: '/' },
      { label: 'Products', route: '/products' },
      { label: 'Product Detail' }
    ];
    component.items = items;
    fixture.detectChanges();

    const breadcrumbElements = fixture.nativeElement.querySelectorAll('.breadcrumbs-item');
    expect(breadcrumbElements.length).toBe(3);
  });

  it('should mark last item as current page', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', route: '/' },
      { label: 'Current Page' }
    ];
    component.items = items;
    fixture.detectChanges();

    const lastItem = fixture.nativeElement.querySelector('.breadcrumbs-current');
    expect(lastItem).toBeTruthy();
    expect(lastItem.getAttribute('aria-current')).toBe('page');
  });

  it('should generate correct ARIA labels', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', route: '/' },
      { label: 'Products' }
    ];
    component.items = items;
    
    expect(component.getAriaLabel(items[0], false)).toBe('Navigate to Home');
    expect(component.getAriaLabel(items[1], true)).toBe('Current page: Products');
  });

  it('should use custom ARIA label if provided', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', route: '/', ariaLabel: 'Go to homepage' }
    ];
    component.items = items;
    
    expect(component.getAriaLabel(items[0], false)).toBe('Go to homepage');
  });
});

