import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent {
  @Input() variant: 'default' | 'success' | 'error' | 'warning' | 'info' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded = true;

  get classes(): string {
    const baseClasses = 'inline-flex items-center font-medium';
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base'
    };

    const variantClasses = {
      default: 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30',
      success: 'bg-success/20 text-success border border-success/30',
      error: 'bg-error/20 text-error border border-error/30',
      warning: 'bg-warning/20 text-warning border border-warning/30',
      info: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
    };

    const roundedClasses = this.rounded ? 'rounded-full' : 'rounded-md';

    return [
      baseClasses,
      sizeClasses[this.size],
      variantClasses[this.variant],
      roundedClasses
    ].join(' ');
  }
}
