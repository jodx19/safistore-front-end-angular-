import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() onClick = new EventEmitter<void>();

  get classes(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary';
    
    const sizeClasses = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-12 px-8 text-base',
      lg: 'h-14 px-10 text-lg'
    };

    const variantClasses = {
      primary: 'bg-gradient-to-tr from-accent-purple to-accent-blue text-white hover:shadow-glow hover:-translate-y-0.5 active:scale-95 focus:ring-accent-purple',
      secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:-translate-y-0.5 active:scale-95 focus:ring-accent-blue',
      outline: 'border border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white focus:ring-accent-purple',
      ghost: 'text-white hover:bg-white/10 focus:ring-accent-purple'
    };

    const stateClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const widthClasses = this.fullWidth ? 'w-full' : '';

    return [
      baseClasses,
      sizeClasses[this.size],
      variantClasses[this.variant],
      stateClasses,
      widthClasses
    ].join(' ');
  }

  handleClick(): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit();
    }
  }
}
