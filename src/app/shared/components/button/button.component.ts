import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [class]="'relative overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group ' + 
               (variant === 'primary' ? 'bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-btn hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(74,108,247,0.5)] ' : '') + 
               (variant === 'secondary' ? 'bg-transparent border-[1.5px] border-white/15 text-brand-white/70 hover:border-brand-blue/50 hover:text-white hover:bg-brand-blue/10 ' : '') + 
               (variant === 'text' ? 'text-brand-white/60 hover:text-white ' : '') + 
               (size === 'sm' ? 'h-9 px-4 text-[13px] rounded-lg ' : '') + 
               (size === 'md' ? 'h-11 px-6 text-[14px] rounded-xl ' : '') + 
               (size === 'lg' ? 'h-[52px] px-8 text-[15px] rounded-2xl ' : '') + 
               (fullWidth ? 'w-full' : '')"
    >
      @if (variant === 'primary') {
        <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
      }
      
      <div class="relative flex items-center justify-center gap-2 font-semibold">
        <ng-content></ng-content>
      </div>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
