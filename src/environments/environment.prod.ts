// PRODUCTION ENVIRONMENT CONFIGURATION
// Update these values when deploying to production
export const environment = {
  production: true,

  // Production API URL - replace with your production server
  apiUrl: 'https://api.safistore.com/api',

  endpoints: {
    auth: '/auth',
    products: '/products',
    categories: '/categories',
    cart: '/cart',
    orders: '/orders',
    users: '/users',
    reviews: '/reviews',
    admin: '/admin',
  },

  features: {
    enableCaching: true, // Cache in production
    enableOfflineMode: true, // Enable offline support
    enableAnalytics: true, // Enable analytics
  },

  timeouts: {
    apiRequest: 30000,
    retryDelay: 1000,
  },
};
