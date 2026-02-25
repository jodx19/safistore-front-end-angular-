import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';

/**
 * Search Results Component
 * Displays search results with filters and sorting options
 */
@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = '';
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' = 'name-asc';
  minPrice = 0;
  maxPrice = 1000;
  breadcrumbItems: BreadcrumbItem[] = [];
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.setupBreadcrumbs();
    this.setupSearchDebounce();
    this.loadCategories();
    this.loadSearchQuery();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup breadcrumb navigation
   */
  private setupBreadcrumbs(): void {
    this.breadcrumbItems = [
      { label: 'Home', route: '/' },
      { label: 'Search Results' }
    ];
  }

  /**
   * Setup search debounce
   */
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.searchQuery = query;
        this.updateUrl();
        this.applyFilters();
      });
  }

  /**
   * Load search query from route
   */
  private loadSearchQuery(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const query = params['q'] || params['search'] || '';
        if (query) {
          this.searchQuery = query;
          this.loadProducts();
        } else {
          this.loading = false;
        }
      });
  }

  /**
   * Load all products
   */
  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.products = data.map((product: any) => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            image: product.image,
            rating: product.rating?.rate ?? 0,
            stock: product.stock ?? 0,
            category: product.category
          }));
          this.loading = false;
          this.applyFilters();
        },
        error: (error) => {
          this.loading = false;
          this.notificationService.showError('Failed to load products');
        }
      });
  }

  /**
   * Load categories
   */
  private loadCategories(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: string[]) => {
          this.categories = data;
        },
        error: (error) => {
          // Silent fail for categories
        }
      });
  }

  /**
   * Handle search input
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

  /**
   * Update URL with search query
   */
  private updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery || null },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Apply filters and sorting
   */
  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= this.minPrice && p.price <= this.maxPrice
    );

    // Sorting
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
  }

  /**
   * Sort products
   */
  private sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    switch (this.sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }

  /**
   * Handle category change
   */
  onCategoryChange(): void {
    this.applyFilters();
  }

  /**
   * Handle price change
   */
  onPriceChange(): void {
    if (this.minPrice > this.maxPrice) {
      const tmp = this.minPrice;
      this.minPrice = this.maxPrice;
      this.maxPrice = tmp;
    }
    this.applyFilters();
  }

  /**
   * Handle sort change
   */
  onSortChange(): void {
    this.applyFilters();
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product): void {
    const success = this.cartService.addToCart(product, product.stock);
    if (success) {
      this.notificationService.showSuccess(`${product.title} added to cart!`);
    } else {
      if (product.stock === 0) {
        this.notificationService.showError(`${product.title} is out of stock.`);
      } else {
        this.notificationService.showWarning(`Cannot add more. Only ${product.stock} available.`);
      }
    }
  }

  /**
   * Handle image error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/600x600?text=No+Image';
  }
}

