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

    // Fetch products with server-side filtering (category + search)
    // Pagination is done client-side for now
    this.productService.getAllProducts({
      category: this.selectedCategory !== 'All' ? this.selectedCategory : undefined,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (response: any) => {
        let items: any[] = [];

        // Handle the actual backend response shape: { success, data: { products: [...], pagination } }
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

        // Map API fields to template-expected fields
        this.products = items.map((p: any) => ({
          id: p.id,
          title: p.title || p.name,
          name: p.name || p.title,
          description: p.description || '',
          price: p.price,
          stock: p.stock,
          categoryId: p.categoryId,
          categoryName: p.categoryName || p.category || '',
          category: p.category || p.categoryName || '',
          imageUrl: p.imageUrl,
          image: p.imageUrl || p.image || 'https://placehold.co/400x300/1a1a2e/a78bfa?text=SafiStore',
          thumbnail: p.imageUrl || p.thumbnail || 'https://placehold.co/400x300/1a1a2e/a78bfa?text=SafiStore',
          rating: p.rating || 0,
          comparePrice: p.comparePrice,
          isNew: !!p.isNew,
          isSale: !!p.isSale,
          isFeatured: !!p.isFeatured,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          brand: p.brand || '',
          reviewCount: p.reviewCount || 0,
          tags: p.tags || [],
          specifications: p.specifications || {}
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

    // Brand filter (not handled server-side)
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p => p.brand && this.selectedBrands.includes(p.brand));
    }

    // Price filter (not handled server-side)
    filtered = filtered.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);

    // Stock filter (not handled server-side)
    if (this.inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
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
        filtered.sort((a, b) => (+b.isNew) - (+a.isNew));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (+b.isFeatured) - (+a.isFeatured));
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

