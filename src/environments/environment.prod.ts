// PRODUCTION ENVIRONMENT CONFIGURATION
export const environment = {
  production: true,

  // Production API base URL
  apiUrl: 'https://safistore.runasp.net/api/v1',

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
