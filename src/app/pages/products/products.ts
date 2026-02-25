import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CartService } from "../../services/cart";
import { ProductService, Product } from "../../services/product";
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonLoaderComponent, EmptyStateComponent],
  templateUrl: "./products.html",
  styleUrls: ["./products.css"],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = "";
  minPrice = 0;
  maxPrice = 1000;
  searchQuery = "";
  loading = true;
  error = "";
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    // read optional search query param
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params["search"]) {
          this.searchQuery = params["search"];
        }
      });

    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
            category: product.category,
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

  applyFilters() {
    let filtered = [...this.products];

    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= this.minPrice && p.price <= this.maxPrice
    );

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onPriceChange() {
    // ensure min <= max
    if (this.minPrice > this.maxPrice) {
      const tmp = this.minPrice;
      this.minPrice = this.maxPrice;
      this.maxPrice = tmp;
    }
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  addToCart(product: Product) {
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

  getRatingArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getDiscount(original: number, current: number): number {
    return Math.round(((original - current) / original) * 100);
  }

  onImageError(event: any) {
    event.target.src = "https://via.placeholder.com/600x600?text=No+Image";
  }
}
