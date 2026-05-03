import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'secondary' | 'white' = 'primary';

  get sizeClasses(): string {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    return sizes[this.size];
  }

  get colorClasses(): string {
    const colors = {
      primary: 'text-accent-purple',
      secondary: 'text-accent-blue',
      white: 'text-white'
    };
    return colors[this.color];
  }
}
