
import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin-guard';

/**
 * Application Routes with Lazy Loading
 * Routes are lazy-loaded to improve initial bundle size and performance
 */
export const routes: Routes = [
  // Landing Page - Public route
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then(m => m.LandingComponent)
  },
  
  // Auth Routes - Public routes
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  
  // Protected Routes - Require authentication
  {
    path: 'search',
    loadComponent: () => import('./pages/search-results/search-results').then(m => m.SearchResultsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/review',
    loadComponent: () => import('./pages/order-review/order-review.component').then(m => m.OrderReviewComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./components/wishlist/wishlist').then(m => m.WishlistComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/order-history/order-history').then(m => m.OrderHistoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'track',
    loadComponent: () => import('./pages/track-order/track-order').then(m => m.TrackOrderComponent),
    canActivate: [AuthGuard]
  },
  
  // Admin Routes - Require admin role
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./admin/manage-products/manage-products').then(m => m.ManageProductsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/orders',
    loadComponent: () => import('./admin/manage-orders/manage-orders').then(m => m.ManageOrdersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/admins',
    loadComponent: () => import('./admin/manage-admins/manage-admins').then(m => m.ManageAdminsComponent),
    canActivate: [AdminGuard]
  }
];
