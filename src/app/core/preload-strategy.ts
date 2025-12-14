import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Custom Preload Strategy
 * Preloads only critical routes after initial load
 * Non-critical routes are preloaded after a delay
 */
@Injectable({
  providedIn: 'root'
})
export class CustomPreloadStrategy implements PreloadingStrategy {
  /**
   * Preload route based on custom logic
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Critical routes to preload immediately
    const criticalRoutes = ['products', 'cart', 'checkout'];
    const routePath = route.path || '';

    // Check if route is critical
    if (criticalRoutes.some(critical => routePath.includes(critical))) {
      // Preload immediately for critical routes
      return load();
    }

    // For non-critical routes, preload after 2 seconds
    return timer(2000).pipe(
      mergeMap(() => load())
    );
  }
}

