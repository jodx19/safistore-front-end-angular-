<p align="center">
  <img src="https://img.shields.io/badge/Angular_20-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 20" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NSwag-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="NSwag" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<h1 align="center">🛍️ SafiStore — Frontend</h1>

<p align="center">
  <strong>Modern Angular e-commerce frontend with a stunning dark-themed UI</strong>
  <br />
  Fast · Reactive · Production-Ready
</p>

<p align="center">
  <a href="https://safistore.vercel.app" target="_blank">🌐 Live Demo</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/jodx19/SafiStore-Backend-API" target="_blank">📦 Backend API</a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Pages & Features](#-pages--features)
- [Authentication Flow](#-authentication-flow)
- [Getting Started](#-getting-started)
- [Production Build](#-production-build)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Performance](#-performance)
- [Security](#-security)

---

## 🚀 Overview

SafiStore Frontend is a **production-grade Angular application** delivering a premium e-commerce experience with a sleek dark-themed design system. Built with Angular 20 standalone components and Tailwind CSS.

### Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Dark-Themed UI** | Premium glassmorphism design with gradient accents |
| 🔐 **JWT Auth** | Login/register with auto token refresh |
| 🛍️ **Product Catalog** | Grid view with filtering, sorting, pagination |
| 🛒 **Shopping Cart** | Persistent cart with drawer preview |
| 📦 **Order Management** | Checkout flow, history, tracking |
| ⭐ **Reviews** | Purchase-verified ratings and comments |
| 👑 **Admin Panel** | Full CRUD management dashboard |
| 📱 **Responsive** | Mobile-first adaptive layout |
| ⚡ **Performance** | Lazy loading, Signals, debounced search |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Angular 20 (Standalone Components) |
| **UI** | Tailwind CSS, Custom Design System |
| **State** | RxJS Signals, BehaviorSubjects |
| **API Client** | NSwag-generated TypeScript client |
| **Auth** | JWT interceptor with auto-refresh |
| **Build** | Angular CLI, Vite |
| **Deployment** | Vercel |
| **Package Manager** | npm |

---

## 🏗 Architecture

```
src/app/
├── admin/                      # Admin panel (role-protected)
│   ├── admin-dashboard/        # KPI dashboard with real API data
│   ├── admin-layout/           # Sidebar navigation layout
│   ├── admin-settings/         # Store settings
│   ├── analytics/              # Sales analytics
│   ├── manage-admins/          # Admin user management
│   ├── manage-customers/       # Customer management
│   ├── manage-orders/          # Order management with filters
│   └── manage-products/        # Product CRUD
├── api-client/                 # NSwag-generated typed API client
├── auth/                       # Login / Register (Reactive Forms)
├── components/                 # Reusable shared components
│   ├── ui/                     # Button, Badge, Card, Input, Modal, Spinner
│   ├── breadcrumbs/            # Breadcrumb navigation
│   ├── cart-drawer/            # Slide-out cart preview
│   ├── notification/           # Toast notification system
│   ├── product/                # ProductCard, ProductGrid
│   ├── skeleton/               # Loading skeletons
│   └── wishlist/               # Wishlist page
├── core/                       # Core layout components
│   └── components/navbar/      # Responsive navigation bar
├── features/home/              # Landing page sections
├── interceptors/               # HTTP pipeline
│   ├── auth.interceptor.ts     # Bearer token + 401 refresh
│   └── error.interceptor.ts    # User-friendly error messages
├── pages/                      # Feature pages
│   ├── about/                  # About page
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Multi-step checkout
│   ├── forgot-password/        # Password reset request
│   ├── not-found/              # 404 page
│   ├── order-history/          # User order history
│   ├── order-review/           # Order review before submission
│   ├── order-success/          # Order confirmation
│   ├── product-detail/         # Product detail with reviews
│   ├── products/               # Product listing with filters
│   ├── profile/                # User profile management
│   ├── reset-password/         # Password reset form
│   ├── search-results/         # Search results page
│   └── track-order/            # Order tracking
├── services/                   # Business logic & state
│   ├── auth.service.ts         # Auth state + JWT management
│   ├── cart.service.ts         # Cart state management
│   ├── order.service.ts        # Order API calls
│   ├── product.service.ts      # Product API calls
│   ├── review.service.ts       # Review API calls
│   ├── wishlist.service.ts     # Wishlist state
│   ├── tracking.service.ts     # Order tracking API
│   └── notification.service.ts # Toast notifications
├── shared/                     # Shared directives & utilities
│   └── directives/             # reveal.directive (scroll animations)
└── utils/                      # Helper classes
```

---

## 📄 Pages & Features

### Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Hero, categories, featured products, testimonials, CTA |
| `/products` | **Product Listing** | Grid with category filter, price sort, search, pagination |
| `/products/:id` | **Product Detail** | Gallery, reviews, add to cart |
| `/search` | **Search Results** | Debounced search with filters |
| `/about` | **About** | Company information |
| `/auth/login` | **Login** | Glassmorphism form with validation |
| `/auth/register` | **Register** | Full validation with password strength indicator |
| `/forgot-password` | **Forgot Password** | Email-based reset request |
| `/reset-password` | **Reset Password** | Token-based password reset |

### Protected Pages (Require Auth)

| Route | Page | Description |
|-------|------|-------------|
| `/profile` | **Profile** | Edit name, address, change password |
| `/cart` | **Cart** | Full cart with quantity controls |
| `/checkout` | **Checkout** | Multi-step: Shipping → Payment → Review |
| `/orders` | **Order History** | List of past orders with status |
| `/track` | **Track Order** | Real-time order tracking |
| `/wishlist` | **Wishlist** | Saved products |

### Admin Pages (Require Admin Role)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/dashboard` | **Dashboard** | KPI cards, recent orders, low stock alerts |
| `/admin/products` | **Manage Products** | Full CRUD with image upload |
| `/admin/orders` | **Manage Orders** | Filter by status, search, date range |
| `/admin/admins` | **Manage Admins** | Create/remove admin users |
| `/admin/customers` | **Manage Customers** | View customer list |
| `/admin/analytics` | **Analytics** | Sales data visualization |
| `/admin/settings` | **Settings** | Store configuration |

---

## 🔐 Authentication Flow

```
Login / Register
      ↓
JWT tokens stored in AuthService (BehaviorSubject)
      ↓
AuthInterceptor attaches Bearer token to all requests
      ↓
On 401: Interceptor attempts refresh token
      ↓
On refresh failure: Redirect to login
      ↓
AdminGuard checks role before activating admin routes
```

### Auth Interceptor Features

- Auto-attaches `Authorization: Bearer <token>` header
- Intercepts 401 responses and attempts silent token refresh
- Queues concurrent requests during refresh to avoid race conditions
- Redirects to login on refresh failure
- Emits `Token-Expired` header detection

---

## 🧪 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (v9+)
- Angular CLI (`npm install -g @angular/cli`)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/jodx19/safistore-front-end-angular-.git
cd safistore-front-end-angular-

# 2. Install dependencies
npm install

# 3. Start development server
ng serve
```

Open **http://localhost:4200** in your browser.

### Environment Configuration

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5084/api/v1'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://safis.runasp.net/api/v1'
};
```

### Regenerate API Client

After backend changes, regenerate the TypeScript client:

```bash
npx nswag run nswag.json
```

---

## 🏗 Production Build

```bash
# Build for production
npm run build -- --configuration=production

# Output: dist/
# Preview locally:
npx serve -s dist
```

### Build Optimization

- **Lazy Loading**: All feature modules are lazy-loaded
- **Ahead-of-Time (AOT)**: Enabled by default in production
- **Tree Shaking**: Dead code elimination
- **Budget Checks**: Size budgets configured in `angular.json`
- **Source Maps**: Disabled in production for security

---

## 🚀 Deployment

The application is compatible with:

| Platform | Notes |
|----------|-------|
| **Vercel** | ✅ Recommended — auto-deploys from GitHub |
| **Netlify** | Configure redirects for SPA routing |
| **Azure Static Web Apps** | Full CI/CD integration |
| **Firebase Hosting** | Fast CDN delivery |
| **Nginx / Apache** | Configure SPA fallback to `index.html` |

### Vercel Deployment

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Set environment variable:
- `NEXT_PUBLIC_API_URL` → `https://safis.runasp.net/api/v1`

---

## 🔄 API Integration

The project uses **NSwag-generated TypeScript client** for type-safe API communication:

- **Strong Typing**: All DTOs are automatically synced with the backend
- **Compile-Time Safety**: API contract violations caught at build time
- **Single Source of Truth**: Regenerate with `npx nswag run nswag.json`

```
Backend Swagger JSON
        ↓
    NSwag Generator
        ↓
api-client.ts ← All components use this
```

---

## ⚡ Performance

| Optimization | Implementation |
|-------------|---------------|
| **Lazy Loading** | All routes load on demand |
| **Signals** | Lightweight state management over RxJS |
| **Debounced Search** | 500ms debounce on product search |
| **CDN** | Images and assets cached globally |
| **Skeleton Loading** | Placeholder UI during data fetch |
| **Preload Strategy** | `PreloadAllModules` for instant navigation |

---

## 🛡 Security

- **No Secrets in Client**: API keys are stored only in backend
- **JWT Interceptor**: Automatic token attachment and refresh
- **Admin Guard**: Route-level protection for admin pages
- **Input Validation**: Both template-driven and reactive forms
- **Error Sanitization**: User-friendly error messages (no stack traces)
- **XSS Protection**: Angular's built-in sanitization
- **CORS**: Backend restricts origins to specific domains

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <br />
  Made with 💜 by <strong>الصافي</strong>
  <br />
  <sub>Built with performance, security, and scalability in mind.</sub>
</p>
