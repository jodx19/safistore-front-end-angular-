
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ProductService, Product } from "../../services/product";

@Component({
  selector: "app-manage-products",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./manage-products.html",
  styleUrls: ["./manage-products.css"],
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: 79.99,
      description: "High-quality headphones",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: 4.5,
      stock: 45,
      category: "Electronics",
    },
    {
      id: 2,
      title: "USB-C Cable",
      price: 9.99,
      description: "Durable cable",
      image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
      rating: 4.0,
      stock: 120,
      category: "Electronics",
    },
    {
      id: 3,
      title: "Cotton T-Shirt",
      price: 24.99,
      description: "Comfortable shirt",
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      rating: 4.2,
      stock: 80,
      category: "Fashion",
    },
    {
      id: 4,
      title: "Running Shoes",
      price: 89.99,
      description: "Professional shoes",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      rating: 4.8,
      stock: 30,
      category: "Sports",
    },
  ];

  newProduct = { title: "", price: 0, stock: 0, category: "", description: "" };
  categories = ["Electronics", "Fashion", "Home", "Sports", "Books"];
  showForm = false;
  loading = false;
  error = "";
  success = "";

  // ✅ Add edit mode
  editingProduct: Product | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/products"]);
    }
  }

  addProduct() {
    if (
      !this.newProduct.title ||
      !this.newProduct.price ||
      !this.newProduct.stock
    ) {
      this.error = "Please fill in all fields";
      return;
    }

    const product: Product = {
      id: this.products.length + 1,
      title: this.newProduct.title,
      price: this.newProduct.price,
      stock: this.newProduct.stock,
      category: this.newProduct.category,
      description: this.newProduct.description,
      image: "",
      rating: 0,
    };

    this.products.push(product);
    this.newProduct = {
      title: "",
      price: 0,
      stock: 0,
      category: "",
      description: "",
    };
    this.showForm = false;
    this.success = "Product added successfully!";
    setTimeout(() => (this.success = ""), 3000);
  }

  // ✅ Add edit method
  editProduct(product: Product) {
    this.editingProduct = { ...product };
    this.newProduct = {
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
    };
    this.showForm = true;
  }

  // ✅ Add save edit method
  saveEdit() {
    if (this.editingProduct) {
      const index = this.products.findIndex(
        (p) => p.id === this.editingProduct!.id
      );
      if (index > -1) {
        this.products[index] = {
          ...this.editingProduct,
          title: this.newProduct.title,
          price: this.newProduct.price,
          stock: this.newProduct.stock,
          category: this.newProduct.category,
          description: this.newProduct.description,
        };
        this.success = "Product updated successfully!";
        this.cancelEdit();
        setTimeout(() => (this.success = ""), 3000);
      }
    }
  }

  // ✅ Add cancel edit
  cancelEdit() {
    this.editingProduct = null;
    this.newProduct = {
      title: "",
      price: 0,
      stock: 0,
      category: "",
      description: "",
    };
    this.showForm = false;
  }

  deleteProduct(id: number) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.products = this.products.filter((p) => p.id !== id);
      this.success = "Product deleted successfully!";
      setTimeout(() => (this.success = ""), 3000);
    }
  }
}