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

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["search"]) {
        this.searchQuery = params["search"];
      }
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
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        this.products = data.map((product: any) => ({
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

  applyFilters() {
    let filtered = [...this.products];

    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.categoryName === this.selectedCategory);
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
          p.categoryName?.toLowerCase().includes(q)
      );
    }

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
    this.applyFilters();
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
    this.applyFilters();
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

