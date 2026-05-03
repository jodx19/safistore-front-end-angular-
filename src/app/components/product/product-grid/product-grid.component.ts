import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../data/mock-data';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SpinnerComponent],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() columns: 1 | 2 | 3 | 4 = 4;
  @Input() showWishlist = true;
  @Input() showQuickView = true;
  @Output() onWishlistToggle = new EventEmitter<Product>();

  get gridClasses(): string {
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    };
    return `grid ${columnClasses[this.columns]} gap-6`;
  }

  handleWishlistToggle(product: Product): void {
    this.onWishlistToggle.emit(product);
  }
}
