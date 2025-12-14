import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { CartService } from "../../services/cart";
import { AuthService, User } from "../../services/auth.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: "./header.html",
  styleUrls: ["./header.css"],
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  searchQuery = "";
  isAuthenticated$: Observable<User | null>;
  currentUser: User | null = null;
  showMobileMenu = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items: any[]) => {
      this.cartCount = items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
    });

    this.isAuthenticated$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.showMobileMenu = false;
  }

  search(query: string) {
    if (!query.trim()) return;

    this.router.navigate(["/search"], {
      queryParams: { q: query.trim() },
    });

    this.searchQuery = "";
    this.showMobileMenu = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  navigateToAdmin() {
    this.router.navigate(["/admin/dashboard"]);
    this.showMobileMenu = false;
  }

  goToHome() {
    this.router.navigate(["/"]);
    this.showMobileMenu = false;
  }
}
