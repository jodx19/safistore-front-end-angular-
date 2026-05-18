import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs';


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
    BreadcrumbsComponent
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
    this.productService.getAllProducts({ search: this.searchQuery || undefined })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          let items: any[] = [];
          if (response?.data?.products) {
            items = response.data.products;
          } else if (Array.isArray(response)) {
            items = response;
          } else if (response?.data?.items) {
            items = response.data.items;
          } else if (response?.data && Array.isArray(response.data)) {
            items = response.data;
          } else if (response?.items) {
            items = response.items;
          }

          this.products = items.map((product: any) => ({
            id: product.id,
            title: product.title || product.name,
            name: product.name || product.title,
            description: product.description || '',
            price: product.price,
            stock: product.stock ?? 0,
            categoryId: product.categoryId ?? 0,
            categoryName: product.categoryName || product.category || '',
            category: product.category || product.categoryName || '',
            imageUrl: product.imageUrl,
            image: product.imageUrl || null,
            thumbnail: product.imageUrl || null,
            rating: product.rating ?? 0,
            comparePrice: product.comparePrice,
            isNew: !!product.isNew,
            isSale: !!product.isSale,
            isFeatured: !!product.isFeatured,
            createdAt: product.createdAt || new Date().toISOString(),
            updatedAt: product.updatedAt || new Date().toISOString(),
            brand: product.brand || '',
            reviewCount: product.reviewCount || 0,
            tags: product.tags || [],
            specifications: product.specifications || {}
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
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.categories = response.map((c: any) => c.name || c);
          } else if (response?.data && Array.isArray(response.data)) {
            this.categories = response.data.map((c: any) => c.name || c);
          }
        },
        error: () => {}
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
          p.categoryName?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.categoryName === this.selectedCategory);
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
    this.cartService.addToCart(product, 1).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.showSuccess(`${product.title} added to cart!`);
        }
      }
    });
  }

  /**
   * Handle image error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}

