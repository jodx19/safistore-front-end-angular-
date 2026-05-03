import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() showCloseButton = true;
  @Output() onClose = new EventEmitter<void>();

  get modalClasses(): string {
    const baseClasses = 'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300';
    const visibilityClasses = this.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible';
    return [baseClasses, visibilityClasses].join(' ');
  }

  get backdropClasses(): string {
    const baseClasses = 'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300';
    const visibilityClasses = this.isOpen ? 'opacity-100' : 'opacity-0';
    return [baseClasses, visibilityClasses].join(' ');
  }

  get contentClasses(): string {
    const baseClasses = 'relative w-full max-h-[90vh] overflow-y-auto card-glass transform transition-all duration-300';
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };
    const transformClasses = this.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4';
    return [baseClasses, sizeClasses[this.size], transformClasses].join(' ');
  }

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }
}
