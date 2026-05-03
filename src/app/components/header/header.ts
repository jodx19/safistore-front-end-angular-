import { Component, OnInit, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from "@angular/router";
import { CartService } from "../../services/cart";
import { AuthService, User } from "../../services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: "./header.html",
  styleUrls: ["./header.css"],
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  wishlistCount = 0;
  searchQuery = "";
  isAuthenticated$: Observable<User | null>;
  currentUser: User | null = null;
  showMobileMenu = false;
  isAuthPage = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
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

    this.wishlistService.wishlistItems$.subscribe((items: any[]) => {
      this.wishlistCount = items.length;
    });

    this.isAuthenticated$.subscribe((user) => {
      this.currentUser = user;
    });

    // Check if current route is auth page
    this.checkAuthPage(this.router.url);
    
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkAuthPage(event.url);
    });
  }

  checkAuthPage(url: string) {
    this.isAuthPage = url === '/login' || url === '/register';
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
