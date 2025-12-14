import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string;
  route?: string;
  ariaLabel?: string;
}

/**
 * Breadcrumbs Component
 * Provides accessible navigation breadcrumbs with ARIA support
 * 
 * @example
 * ```html
 * <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
 * ```
 */
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./breadcrumbs.css']
})
export class BreadcrumbsComponent {
  /**
   * Array of breadcrumb items
   * Last item should not have a route (current page)
   */
  @Input() items: BreadcrumbItem[] = [];

  /**
   * Get ARIA label for breadcrumb item
   */
  getAriaLabel(item: BreadcrumbItem, isLast: boolean): string {
    if (item.ariaLabel) {
      return item.ariaLabel;
    }
    return isLast 
      ? `Current page: ${item.label}` 
      : `Navigate to ${item.label}`;
  }

  /**
   * Check if item is the last in the list
   */
  isLastItem(index: number): boolean {
    return index === this.items.length - 1;
  }
}

