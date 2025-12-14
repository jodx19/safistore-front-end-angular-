import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton Loader Component
 * Displays animated placeholder content while data is loading
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.html',
  styleUrls: ['./skeleton-loader.css']
})
export class SkeletonLoaderComponent {
  @Input() type: 'text' | 'card' | 'list' | 'image' = 'text';
  @Input() count: number = 1;
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
}

