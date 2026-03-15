import { Component } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="py-24 bg-brand-dark/30 border-y border-brand-border relative overflow-hidden">
      <!-- Glow background -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-brand-blue/5 blur-[120px]"></div>

      <div 
        appReveal
        class="max-w-[1200px] mx-auto px-6 relative z-10"
      >
        <div class="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
          
          <!-- Metric 1 -->
          <div class="flex-1 flex flex-col items-center text-center px-8">
            <h3 class="font-display text-6xl md:text-7xl font-extrabold text-white mb-4 animate-count-up">
              50K+
            </h3>
            <span class="text-[13px] text-brand-muted uppercase tracking-[0.2em] font-semibold">Active Customers</span>
            <div class="w-12 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full mt-6 shadow-glow"></div>
          </div>

          <!-- Divider -->
          <div class="hidden md:block w-px h-24 bg-white/10"></div>

          <!-- Metric 2 -->
          <div class="flex-1 flex flex-col items-center text-center px-8">
            <h3 class="font-display text-6xl md:text-7xl font-extrabold text-white mb-4 animate-count-up">
              200K+
            </h3>
            <span class="text-[13px] text-brand-muted uppercase tracking-[0.2em] font-semibold">Products Shipped</span>
            <div class="w-12 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full mt-6 shadow-glow"></div>
          </div>

          <!-- Divider -->
          <div class="hidden md:block w-px h-24 bg-white/10"></div>

          <!-- Metric 3 -->
          <div class="flex-1 flex flex-col items-center text-center px-8">
            <h3 class="font-display text-6xl md:text-7xl font-extrabold text-white mb-4 animate-count-up">
              99.9%
            </h3>
            <span class="text-[13px] text-brand-muted uppercase tracking-[0.2em] font-semibold">Uptime Protocol</span>
            <div class="w-12 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full mt-6 shadow-glow"></div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class MetricsComponent {}
