
/**
 * API Helper utility class
 * Provides methods to construct API URLs consistently across the application
 *
 * USAGE:
 * - ApiHelper.getApiUrl('/products') → 'http://localhost:5000/api/products'
 * - ApiHelper.getEndpoint('products') → 'http://localhost:5000/api/products'
 */
import { environment } from '../../environments/environment';
export class ApiHelper {
  /**
   * Get full API URL for an endpoint
   * @param endpoint - Endpoint path (e.g., '/products' or 'products')
   * @returns Full URL (e.g., 'http://localhost:5000/api/products')
   *
   * EXAMPLE:
   * const url = ApiHelper.getApiUrl('/products');
   * // Returns: 'http://localhost:5000/api/products'
   */
  static getApiUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${environment.apiUrl}/${cleanEndpoint}`;
  }

  /**
   * Get endpoint URL from environment config
   * Provides type-safe access to configured endpoints
   * @param key - Endpoint key from environment.endpoints
   * @returns Full URL
   *
   * EXAMPLE:
   * const url = ApiHelper.getEndpoint('products');
   * // Returns: 'http://localhost:5000/api/products'
   */
  static getEndpoint(key: keyof typeof environment.endpoints): string {
    return this.getApiUrl(environment.endpoints[key]);
  }
}
