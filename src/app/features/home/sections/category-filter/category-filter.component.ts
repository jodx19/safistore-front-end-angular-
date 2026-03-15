import { Component } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <div class="sticky top-[70px] z-40 bg-brand-navy/80 backdrop-blur-xl border-b border-brand-border py-4">
      <div class="max-w-[1200px] mx-auto px-6 flex items-center gap-3 overflow-x-auto no-scrollbar">
        @for (cat of categories; track cat; let i = $index) {
          <button 
            [appReveal]="i * 0.05"
            (click)="activeCategory = cat"
            [class.bg-brand-blue]="activeCategory === cat"
            [class.text-white]="activeCategory === cat"
            [class.bg-white/5]="activeCategory !== cat"
            [class.text-brand-muted]="activeCategory !== cat"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all hover:bg-brand-blue/20 whitespace-nowrap"
          >
            {{ cat }}
          </button>
        }
      </div>
    </div>
  `
})
export class CategoryFilterComponent {
  categories = ['All Products', 'Computers', 'Audio', 'Wearables', 'Gaming', 'Accessories', 'Phone'];
  activeCategory = 'All Products';
}
