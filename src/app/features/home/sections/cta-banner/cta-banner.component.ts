import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [ButtonComponent, RevealDirective],
  template: `
    <section class="py-24 px-6 overflow-hidden">
      <div 
        appReveal
        class="max-w-[1100px] mx-auto relative bg-gradient-to-br from-brand-dark/80 to-brand-card/80 border border-white/10 rounded-[40px] p-10 md:p-20 overflow-hidden"
      >
        <!-- Background Glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          <!-- Left: Visual -->
          <div class="w-full lg:w-[40%] flex justify-center relative">
            <div class="relative">
              <img src="/assets/images/headphones.png" alt="Premium Headphones" class="w-[280px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float">
              
              <div class="absolute -bottom-4 -right-4 bg-gradient-to-tr from-brand-blue to-brand-purple p-4 rounded-2xl shadow-glow">
                <span class="font-display text-2xl font-bold text-white">$299.99</span>
              </div>
            </div>
          </div>

          <!-- Right: Content -->
          <div class="w-full lg:w-[60%] text-center lg:text-left">
            <span class="block text-[11px] font-semibold text-brand-blue tracking-[0.3em] uppercase mb-4">LIMITED EDITION</span>
            <h2 class="font-display text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white leading-tight mb-6">
              Elevate Your <span class="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">Inventory</span>
            </h2>
            <p class="text-[15px] text-brand-white/50 leading-relaxed max-w-[480px] mb-10 mx-auto lg:mx-0">
              Join the elite circle of SafiStore members. Get exclusive access to prototype tech and priority fulfillment on all limited drops.
            </p>

            <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
              <app-button variant="primary" size="lg">Secure Yours Now</app-button>
              <app-button variant="secondary" size="lg">View Specs</app-button>
            </div>

            <!-- Trust Badges -->
            <div class="flex flex-wrap items-center gap-6 mt-12 justify-center lg:justify-start opacity-50">
              <div class="flex items-center gap-2 text-xs text-white">
                <span class="text-brand-blue text-[14px]">✓</span>
                FREE RETURNS
              </div>
              <div class="flex items-center gap-2 text-xs text-white">
                <span class="text-brand-blue text-[14px]">✓</span>
                2 YEAR WARRANTY
              </div>
              <div class="flex items-center gap-2 text-xs text-white">
                <span class="text-brand-blue text-[14px]">✓</span>
                24/7 SUPPORT
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class CtaBannerComponent {}
