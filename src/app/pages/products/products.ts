import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CartService } from "../../services/cart";
import { NotificationService } from '../../services/notification.service';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    ProductGridComponent,
    ButtonComponent,
    BadgeComponent
  ],
  templateUrl: "./products.html",
  styleUrls: ["./products.css"],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Computers', 'Audio', 'Wearables', 'Gaming', 'Accessories', 'Phone'];
  selectedCategory = "All";
  selectedBrands: string[] = [];
  minPrice = 0;
  maxPrice = 5000;
  searchQuery = "";
  sortBy = "featured";
  loading = false;
  error = "";
  inStockOnly = false;

  // Pagination
  readonly pageSize = 12;
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params["search"]) {
        this.searchQuery = params["search"];
      }
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        // Handle various possible backend response formats
        let items = [];
        if (Array.isArray(response)) {
          items = response;
        } else if (response?.data?.items) {
          items = response.data.items;
        } else if (response?.data && Array.isArray(response.data)) {
          items = response.data;
        } else if (response?.items) {
          items = response.items;
        }

        this.products = items.map((p: any) => ({
          ...p,
          id: p.id,
          title: p.title || p.name,
          categoryName: p.categoryName || p.category,
          price: p.price,
          rating: p.rating || 0,
          stock: p.stock || 0,
          image: p.imageUrl || p.image || 'https://via.placeholder.com/300'
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
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
    let filtered = [...this.products];

    // Category filter
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Brand filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p => p.brand && this.selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);

    // Stock filter
    if (this.inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        (p.title && p.title.toLowerCase().includes(query)) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    this.filteredProducts = filtered;
    this.totalProducts = filtered.length;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
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

  onAddToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.showSuccess(`${product.name} added to cart!`);
        }
      }
    });
  }

  onAddToWishlist(product: Product) {
    // Wishlist functionality is handled internally by the ProductCard component
    // which calls WishlistService and shows its own notification.
  }

  onBrandToggle(brand: string) {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }
}

