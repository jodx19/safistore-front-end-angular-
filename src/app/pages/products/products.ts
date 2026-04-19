import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CartService } from "../../services/cart";
import { ProductService, Product } from "../../services/product";
import { NotificationService } from '../../services/notification.service';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    SkeletonLoaderComponent, 
    EmptyStateComponent,
    ProductCardComponent,
    RevealDirective
  ],
  templateUrl: "./products.html",
  styleUrls: ["./products.css"],
})
export class ProductsComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  products: Product[] = [];
  filteredProducts: any[] = []; // Using any[] to match ProductCard expectations
  categories: string[] = [];
  selectedCategory = "";
  minPrice = 0;
  maxPrice = 2000;
  searchQuery = "";
  loading = true;
  error = "";

  // ── Pagination state ──────────────────────────────────────────────────────
  readonly pageSize = 40;
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["search"]) {
        this.searchQuery = params["search"];
      }
      this.currentPage = 1;
      this.loadCategories();
      this.loadProducts();
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data: string[]) => {
        this.categories = data;
      },
      error: () => {
        this.error = 'Failed to load categories.';
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.productService.getAllProducts({
      page: this.currentPage,
      limit: this.pageSize,
      category: this.selectedCategory || undefined,
      search: this.searchQuery || undefined,
    }).subscribe({
      next: (response: any) => {
        // The backend returns ApiResponse<PaginatedResult<Product>>
        // Shape: { success, data: { products[], pagination: { page, pageSize, total, totalPages } } }
        const paginatedData = response?.data ?? response;
        const rawList: any[] = paginatedData?.products ?? paginatedData ?? [];
        const pagination = paginatedData?.pagination;

        if (pagination) {
          this.totalPages = pagination.totalPages ?? 1;
          this.totalProducts = pagination.total ?? rawList.length;
          this.currentPage = pagination.page ?? this.currentPage;
        } else {
          // Fallback: if API returns a flat array, paginate client-side
          this.totalPages = 1;
          this.totalProducts = rawList.length;
        }

        this.products = rawList.map((product: any) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
          rating: product.rating ?? 0,
          stock: product.stock ?? 0,
          categoryName: product.categoryName,
          categoryId: product.categoryId ?? 0,
        }));
        this.loading = false;
        this.applyFilters();
      },
      error: () => {
        this.error = 'Failed to load products. Please refresh or try again later.';
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadProducts();
    // Scroll back to top of product grid smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Last item number shown on current page (capped at totalProducts)
   */
  getPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalProducts);
  }

  /**
   * Returns the truncated page number sequence.
   * Always shows first 5 pages, ellipsis, and last page.
   * E.g. for totalPages=192: [1, 2, 3, 4, 5, '...', 192]
   */
  getPaginationPages(): (number | '...')[] {
    if (this.totalPages <= 7) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1, 2, 3, 4, 5];
    if (this.totalPages > 6) pages.push('...');
    pages.push(this.totalPages);
    return pages;
  }

  applyFilters() {
    // Filters that the API already handled server-side: category, search.
    // We only do client-side price filter on the current page's products.
    let filtered = [...this.products];

    filtered = filtered.filter(
      (p) => p.price >= this.minPrice && p.price <= this.maxPrice
    );

    // Map to the interface expected by ProductCardComponent
    this.filteredProducts = filtered.map(p => ({
      id: p.id,
      title: p.title,
      categoryName: p.categoryName,
      price: p.price,
      rating: p.rating,
      reviews: Math.floor(Math.random() * 50) + 5,
      image: p.imageUrl || '',
      isNew: Math.random() > 0.8
    }));
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPriceChange() {
    if (this.minPrice > this.maxPrice) {
      const tmp = this.minPrice;
      this.minPrice = this.maxPrice;
      this.maxPrice = tmp;
    }
    this.applyFilters();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onAddToCart(product: any) {
    // Map back to service expectations
    const serviceProduct: Product = {
      id: product.id,
      title: product.title,
      price: product.price,
      description: '',
      imageUrl: product.image,
      rating: product.rating,
      stock: 99,
      categoryName: product.categoryName,
      categoryId: 0
    };
    
    const success = this.cartService.addToCart(serviceProduct, 1);
    if (success) {
      this.notificationService.showSuccess(`${product.title} added to cart!`);
    } else {
      this.notificationService.showError(`Failed to add ${product.title} to cart.`);
    }
  }

  onAddToWishlist(product: any) {
    this.notificationService.showSuccess(`${product.title} added to wishlist!`);
  }
}

