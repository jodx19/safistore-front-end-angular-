import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  template: `
    <div
      [class]="'inline-flex items-center gap-2 rounded-full font-medium tracking-wide uppercase ' + 
               (variant === 'primary' ? 'bg-brand-blue/12 border border-brand-blue/25 text-brand-blue ' : '') + 
               (variant === 'gradient' ? 'bg-gradient-to-tr from-brand-blue to-brand-purple text-white ' : '') + 
               (variant === 'danger' ? 'bg-red-500/90 text-white ' : '') + 
               (variant === 'success' ? 'bg-green-500/90 text-white ' : '') + 
               (size === 'sm' ? 'px-2.5 py-1 text-[10px] ' : '') + 
               (size === 'md' ? 'px-3.5 py-1.5 text-[11px] ' : '') + 
               (size === 'lg' ? 'px-4 py-2 text-[12px] ' : '')"
    >
      @if (pulse) {
        <div class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
      }
      <ng-content></ng-content>
    </div>
  `
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'gradient' | 'danger' | 'success' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() pulse = false;
}
