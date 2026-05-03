import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() glassmorphism = true;
  @Input() hover = false;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded = true;

  get classes(): string {
    const baseClasses = 'relative overflow-hidden transition-all duration-300';
    
    const glassClasses = this.glassmorphism 
      ? 'bg-bg-card/80 backdrop-blur-xl border border-border'
      : 'bg-bg-secondary border border-border';
    
    const hoverClasses = this.hover 
      ? 'hover:shadow-glow hover:-translate-y-1 hover:border-accent-purple/30'
      : '';
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const roundedClasses = this.rounded ? 'rounded-2xl' : 'rounded-none';

    return [
      baseClasses,
      glassClasses,
      hoverClasses,
      paddingClasses[this.padding],
      roundedClasses
    ].join(' ');
  }
}
