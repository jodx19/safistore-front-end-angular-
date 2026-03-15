import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input('appReveal') delay: number | string = 0;
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Basic transition properties
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)');

    const d = typeof this.delay === 'string' ? parseFloat(this.delay) : Number(this.delay);
    if (!isNaN(d) && d > 0) {
      this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${d}s`);
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.renderer.addClass(this.el.nativeElement, 'revealed');
              // Ensure styles are applied via class from styles.css
              this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
              this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
              this.observer?.unobserve(this.el.nativeElement);
            }
          });
        },
        { threshold: 0.1 }
      );

      this.observer.observe(this.el.nativeElement);
    } else {
      // Fallback
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
