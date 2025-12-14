# 🛍️ SafiStore - Modern E-Commerce Platform

![Angular](https://img.shields.io/badge/Angular-20.3-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Private-orange?style=flat-square)
![Build Status](https://img.shields.io/badge/Build-Passing-success?style=flat-square)
![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=flat-square)

> A modern, full-featured e-commerce platform built with Angular 20, featuring advanced UI/UX, performance optimizations, and comprehensive security measures.

---

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Testing](#-testing)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 Project Description

**SafiStore** is a production-ready, modern e-commerce platform designed to provide an exceptional shopping experience. Built with Angular 20 and TypeScript, it features a clean, responsive UI powered by Tailwind CSS, comprehensive security measures, and advanced performance optimizations.

### Purpose

SafiStore demonstrates best practices in Angular development, including:

- **Security-first architecture** with proper authentication and authorization
- **Performance optimization** through lazy loading, caching, and code splitting
- **Modern UI/UX** with accessibility features and responsive design
- **Scalable architecture** ready for production deployment

### Target Users

- **End Users**: Customers looking for a smooth, intuitive shopping experience
- **Developers**: Teams seeking a reference implementation of Angular best practices
- **Businesses**: Organizations needing a robust e-commerce solution

---

## ✨ Features

### 🔐 Phase 1: Security & Foundation

- ✅ **Environment Configuration**

  - Separate development and production environment files
  - Centralized API URL management
  - Secure configuration handling

- ✅ **Security & Storage**

  - Secure token storage with helper utilities
  - Safe localStorage operations
  - Authentication token management

- ✅ **Error Handling**

  - Custom NotificationService replacing alert() calls
  - Toast notifications with multiple types (success, error, warning, info)
  - Global error handling

- ✅ **Code Quality**
  - Removed duplicate code
  - Centralized interfaces and types
  - Clean, maintainable codebase

### 🚀 Phase 2: Core Improvements

- ✅ **Security & Authentication**

  - HTTP interceptors for automatic token attachment
  - Global error handler for HTTP requests
  - Role-based access control (Admin/User)
  - Secure authentication flow

- ✅ **Backend Integration**

  - Environment-based API configuration
  - User-specific cart storage
  - Stock validation
  - Order persistence

- ✅ **State Management**

  - Centralized state with RxJS BehaviorSubjects
  - Reactive cart and product synchronization
  - Proper subscription management with `takeUntil` pattern

- ✅ **UI/UX Improvements**

  - Unified design system (colors, typography, spacing)
  - Consistent brand identity (SafiStore)
  - Loading states and skeleton loaders
  - Empty states for all lists
  - Responsive design

- ✅ **Performance**
  - Lazy loading for all routes
  - Product data caching (5-minute TTL)
  - Optimized bundle sizes

### 🎨 Phase 3: Advanced Features & Polish

- ✅ **UI/UX Finalization**

  - Breadcrumbs component with ARIA support
  - Product detail page with image gallery
  - Order review page
  - Wishlist component with user-specific persistence
  - Accessibility improvements (skip links, ARIA roles, focus management)

- ✅ **UX Enhancements**

  - Advanced search with 300ms debounce
  - Multi-filter support (category, price range, sorting)
  - Skeleton loaders across all pages
  - Comprehensive empty states

- ✅ **Advanced Features**

  - Product reviews and ratings system
  - Order history tracking
  - Wishlist functionality
  - Review helpfulness voting

- ✅ **Performance & Optimization**

  - Stale-while-revalidate caching strategy
  - Custom route preloading strategy
  - Image lazy loading with dimensions
  - Optimized bundle splitting

- ✅ **Code Quality & Testing**
  - TypeScript strict mode
  - Comprehensive unit tests
  - CI/CD ready scripts
  - JSDoc documentation

---

## 🛠️ Tech Stack

### Core Framework

- **Angular**: `^20.3.0` - Latest Angular with standalone components
- **TypeScript**: `~5.9.2` - Type-safe development
- **RxJS**: `~7.8.0` - Reactive programming

### Styling & UI

- **Tailwind CSS**: `^3.4.0` - Utility-first CSS framework
- **PostCSS**: `^8.5.6` - CSS processing
- **Autoprefixer**: `^10.4.21` - CSS vendor prefixing

### Development Tools

- **Angular CLI**: `^20.3.8` - Development and build tooling
- **Angular Build**: `^20.3.8` - Modern build system
- **Prettier**: Code formatting

### Testing

- **Jasmine**: `~5.9.0` - Testing framework
- **Karma**: `~6.4.0` - Test runner
- **Karma Coverage**: `~2.2.0` - Code coverage

### Build & Deployment

- **ESBuild**: Fast bundling (via Angular Build)
- **TypeScript Compiler**: Type checking and compilation

---

## 📦 Installation

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment** (Optional)

   ```bash
   # Edit src/environments/environment.ts for development
   # Edit src/environments/environment.prod.ts for production
   ```

4. **Start development server**

   ```bash
  c
   # or
   ng serve
   ```

5. **Open in browser**
   ```
   Navigate to http://localhost:4200
   ```

### Production Build

```bash
npm run build:prod
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/ecommerce-project/` directory.

---

## 🚀 Usage

### Application Routes

#### Public Routes

| Route       | Component         | Description                      |
| ----------- | ----------------- | -------------------------------- |
| `/`         | LandingComponent  | Home page with featured products |
| `/login`    | LoginComponent    | User authentication              |
| `/register` | RegisterComponent | New user registration            |

#### Protected Routes (Require Authentication)

| Route              | Component              | Description                      |
| ------------------ | ---------------------- | -------------------------------- |
| `/products`        | ProductsComponent      | Browse all products              |
| `/products/:id`    | ProductDetailComponent | View product details & reviews   |
| `/search`          | SearchResultsComponent | Search with filters              |
| `/cart`            | CartComponent          | Shopping cart                    |
| `/checkout`        | CheckoutComponent      | Checkout process                 |
| `/checkout/review` | OrderReviewComponent   | Review order before confirmation |
| `/orders`          | OrderHistoryComponent  | View order history               |
| `/wishlist`        | WishlistComponent      | User wishlist                    |
| `/track`           | TrackOrderComponent    | Track order status               |

#### Admin Routes (Require Admin Role)

| Route              | Component               | Description           |
| ------------------ | ----------------------- | --------------------- |
| `/admin/dashboard` | AdminDashboardComponent | Admin dashboard       |
| `/admin/products`  | ManageProductsComponent | Product management    |
| `/admin/orders`    | ManageOrdersComponent   | Order management      |
| `/admin/admins`    | ManageAdminsComponent   | Admin user management |

### Common Code Examples

#### Adding Product to Cart

```typescript
import { CartService } from './services/cart';
import { Product } from './services/product';

constructor(private cartService: CartService) {}

addToCart(product: Product) {
  const success = this.cartService.addToCart(product, product.stock);
  if (success) {
    this.notificationService.showSuccess(`${product.title} added to cart!`);
  }
}
```

#### Searching Products

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

search(query: string) {
  this.router.navigate(['/search'], {
    queryParams: { q: query.trim() }
  });
}
```

#### Adding to Wishlist

```typescript
import { WishlistComponent } from './components/wishlist/wishlist';

constructor(private wishlistComponent: WishlistComponent) {}

addToWishlist(product: Product) {
  this.wishlistComponent.addToWishlist(product);
}
```

#### Submitting a Review

```typescript
import { ReviewService } from './services/review.service';

constructor(private reviewService: ReviewService) {}

submitReview(productId: number, review: Review) {
  this.reviewService.addReview(productId, review)
    .subscribe({
      next: (review) => console.log('Review submitted', review),
      error: (error) => console.error('Error', error)
    });
}
```

### Screenshots

> **Note**: Add screenshots of your application here
>
> - Landing page
> - Product listing
> - Product detail with reviews
> - Shopping cart
> - Checkout process
> - Order history

---

## 🧪 Testing

### Unit Tests

Run unit tests with Karma:

```bash
npm test
# or
ng test
```

Run unit tests in CI mode (headless):

```bash
npm run test:unit
```

### Linting

Check code quality:

```bash
npm run lint
```

CI-friendly linting:

```bash
npm run lint:ci
```

### Full Validation Pipeline

Run all checks (lint + tests + build):

```bash
npm run validate
```

### Test Coverage

Generate coverage report:

```bash
ng test --code-coverage
```

Coverage reports will be available in `coverage/` directory.

### CI/CD

The project includes CI-friendly scripts:

- `lint:ci` - Linting for CI environments
- `test:unit` - Headless unit tests
- `build:prod` - Production build
- `validate` - Full validation pipeline

---

## 📁 Folder Structure

```
ecommerce-project/
├── src/
│   ├── app/
│   │   ├── admin/                    # Admin management pages
│   │   │   ├── admin-dashboard/
│   │   │   ├── manage-products/
│   │   │   ├── manage-orders/
│   │   │   └── manage-admins/
│   │   ├── components/               # Reusable components
│   │   │   ├── breadcrumbs/         # Navigation breadcrumbs
│   │   │   ├── empty-state/        # Empty state component
│   │   │   ├── footer/              # Footer component
│   │   │   ├── header/               # Header with navigation
│   │   │   ├── notification/        # Toast notifications
│   │   │   ├── skeleton-loader/     # Loading skeletons
│   │   │   └── wishlist/            # Wishlist component
│   │   ├── core/                     # Core utilities
│   │   │   ├── design-system.ts     # Design tokens
│   │   │   ├── base.component.ts    # Base component class
│   │   │   └── preload-strategy.ts  # Route preloading
│   │   ├── interceptors/            # HTTP interceptors
│   │   │   ├── auth.interceptor.ts  # Auth token injection
│   │   │   └── error.interceptor.ts # Global error handling
│   │   ├── pages/                    # Page components
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout process
│   │   │   ├── landing/              # Landing page
│   │   │   ├── login/                # Login page
│   │   │   ├── order-history/        # Order history
│   │   │   ├── order-review/        # Order review
│   │   │   ├── product-detail/       # Product details
│   │   │   ├── products/             # Product listing
│   │   │   ├── register/             # Registration
│   │   │   ├── search-results/      # Search results
│   │   │   └── track-order/         # Order tracking
│   │   ├── services/                 # Services
│   │   │   ├── admin.service.ts     # Admin operations
│   │   │   ├── api.ts                # API service
│   │   │   ├── auth.service.ts      # Authentication
│   │   │   ├── cart.ts               # Cart management
│   │   │   ├── order.service.ts      # Order operations
│   │   │   ├── product.ts            # Product operations
│   │   │   ├── review.service.ts     # Review management
│   │   │   └── tracking.service.ts   # Order tracking
│   │   ├── utils/                    # Utility functions
│   │   │   └── auth.ts               # Auth helpers
│   │   ├── app.component.ts          # Root component
│   │   ├── app.config.ts             # App configuration
│   │   └── app.routes.ts             # Route definitions
│   ├── environments/                  # Environment configs
│   │   ├── environment.ts            # Development
│   │   └── environment.prod.ts      # Production
│   ├── styles.css                    # Global styles
│   └── main.ts                       # Application entry point
├── docs/                              # Documentation
│   ├── phase3-checklist.md
│   └── phase3-summary.md
├── .github/                           # GitHub templates
│   └── PULL_REQUEST_TEMPLATE.md
├── angular.json                       # Angular configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
└── tailwind.config.js                 # Tailwind config
```

### Key Components

- **Components**: Reusable UI components (breadcrumbs, notifications, etc.)
- **Pages**: Route-level page components
- **Services**: Business logic and API communication
- **Interceptors**: HTTP request/response interceptors
- **Core**: Core utilities and design system
- **Utils**: Helper functions

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Branching Strategy

- **Main/Master**: Production-ready code
- **Feature branches**: `feature/feature-name`
- **Bug fixes**: `fix/bug-description`
- **Hotfixes**: `hotfix/issue-description`

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(cart): add wishlist functionality
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
```

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run validate
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat(scope): your commit message"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Standards

- Follow TypeScript best practices
- Use Angular style guide conventions
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is **private** and proprietary. All rights reserved.

---

## 📧 Contact

For questions, suggestions, or support:

- **Project Repository**: [GitHub Repository URL]
- **Issues**: [GitHub Issues URL]
- **Documentation**: See `docs/` directory for detailed documentation

---

## 🎯 Project Status

✅ **Production Ready** - The application is fully functional and optimized for production deployment.

### Completed Phases

- ✅ Phase 1: Security & Foundation
- ✅ Phase 2: Core Improvements
- ✅ Phase 3: Advanced Features & Polish

### Performance Metrics

- **Initial Bundle**: ~417 KB (111 KB gzipped)
- **Lazy Loading**: All routes code-split
- **Caching**: Stale-while-revalidate strategy
- **Accessibility**: WCAG compliant

---

**Built with ❤️ using Angular 20**
