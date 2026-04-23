
// DEVELOPMENT ENVIRONMENT CONFIGURATION
// This points to your local .NET Web API backend
export const environment = {
  production: false,

  // Main API Base URL - points to .NET Web API
  apiUrl: 'http://localhost:5084/api/v1',

  // Specific endpoint paths (used by Angular services)
  endpoints: {
    auth: '/auth', // Authentication endpoints
    products: '/products', // Product CRUD operations
    categories: '/categories', // Product categories
    cart: '/cart', // Shopping cart operations
    orders: '/orders', // Order management
    users: '/users', // User profile management
    reviews: '/reviews', // Product reviews
    admin: '/admin', // Admin operations
  },

  // Feature flags for development
  features: {
    enableCaching: true, // Cache product data
    enableOfflineMode: false, // Don't use offline mode in dev
    enableAnalytics: false, // Disable analytics in dev
  },

  // Timeout settings (in milliseconds)
  timeouts: {
    apiRequest: 30000, // 30 seconds for API requests
    retryDelay: 1000, // 1 second delay before retry
  },
};

