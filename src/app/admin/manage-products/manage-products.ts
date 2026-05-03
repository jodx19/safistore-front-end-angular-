
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ProductClient, ProductDto, CreateProductDto, UpdateProductDto } from "../../api-client/api-client";
import { Subject, takeUntil } from "rxjs";
import { AdminLayoutComponent } from "../admin-layout/admin-layout";

@Component({
  selector: "app-manage-products",
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: "./manage-products.html",
  styleUrls: ["./manage-products.css"],
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  products: ProductDto[] = [];
  newProduct: CreateProductDto = { title: "", price: 0, stock: 0, categoryId: 1, description: "" };
  categories: any[] = []; // Usually fetched from a category client
  showForm = false;
  loading = false;
  error = "";
  success = "";
  editingProduct: ProductDto | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private productClient: ProductClient
  ) { }

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/products"]);
      return;
    }
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.loading = true;
    this.productClient.getAll(1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.products = resp.data.products;
          this.loading = false;
        },
        error: (err) => {
          this.error = "Failed to load products";
          this.loading = false;
        }
      });
  }

  addProduct() {
    if (!this.newProduct.title || !this.newProduct.price) {
      this.error = "Please fill in required fields";
      return;
    }

    this.loading = true;
    this.productClient.create(this.newProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success = "Product added successfully!";
          this.loadProducts();
          this.cancelEdit();
          setTimeout(() => (this.success = ""), 3000);
        },
        error: () => {
          this.error = "Failed to add product";
          this.loading = false;
        }
      });
  }

  editProduct(product: ProductDto) {
    this.editingProduct = product;
    this.newProduct = {
      title: product.title,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      description: product.description,
      imageUrl: product.imageUrl
    };
    this.showForm = true;
  }

  saveEdit() {
    if (this.editingProduct) {
      this.loading = true;
      const updateDto: UpdateProductDto = { ...this.newProduct };
      this.productClient.update(this.editingProduct.id, updateDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.success = "Product updated successfully!";
            this.loadProducts();
            this.cancelEdit();
            setTimeout(() => (this.success = ""), 3000);
          },
          error: () => {
            this.error = "Failed to update product";
            this.loading = false;
          }
        });
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.newProduct = { title: "", price: 0, stock: 0, categoryId: 1, description: "" };
    this.showForm = false;
    this.error = "";
    this.loading = false;
  }

  deleteProduct(id: number) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.loading = true;
      this.productClient.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.success = "Product deleted successfully!";
            this.loadProducts();
            setTimeout(() => (this.success = ""), 3000);
          },
          error: () => {
            this.error = "Failed to delete product";
            this.loading = false;
          }
        });
    }
  }
}
