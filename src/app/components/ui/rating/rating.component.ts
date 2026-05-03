import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  @Input() rating = 0;
  @Input() maxRating = 5;
  @Input() readonly = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showCount = false;
  @Input() reviewCount = 0;
  @Output() onRatingChange = new EventEmitter<number>();

  get sizeClasses(): string {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return sizes[this.size];
  }

  get stars(): number[] {
    return Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  getStarClass(star: number): string {
    if (star <= this.rating) {
      return 'text-yellow-400 fill-current';
    } else if (star - 0.5 <= this.rating) {
      return 'text-yellow-400 fill-current';
    } else {
      return 'text-gray-600 fill-current';
    }
  }

  getStarType(star: number): 'full' | 'half' | 'empty' {
    if (star <= this.rating) {
      return 'full';
    } else if (star - 0.5 <= this.rating) {
      return 'half';
    } else {
      return 'empty';
    }
  }

  handleStarClick(rating: number): void {
    if (!this.readonly) {
      this.rating = rating;
      this.onRatingChange.emit(rating);
    }
  }

  getStarPath(type: 'full' | 'half' | 'empty'): string {
    if (type === 'full') {
      return 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
    } else if (type === 'half') {
      return 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z';
    } else {
      return 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
    }
  }
}
