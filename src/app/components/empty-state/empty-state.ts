import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Empty State Component
 * Displays a friendly message when there's no data to show
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.css']
})
export class EmptyStateComponent {
  @Input() icon: string = '📦';
  @Input() title: string = 'No items found';
  @Input() message: string = 'There are no items to display at this time.';
  @Input() actionLabel?: string;
  @Input() actionCallback?: () => void;
}

