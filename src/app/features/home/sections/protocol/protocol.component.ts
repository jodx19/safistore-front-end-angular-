import { Component } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-protocol',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="py-24 px-6 relative">
      <div class="max-w-[1200px] mx-auto">
        
        <div class="text-center mb-20">
          <span appReveal class="block text-[11px] font-semibold text-brand-blue tracking-[0.3em] uppercase mb-4">
            OUR CORE VALUES
          </span>
          <h2 [appReveal]="0.1" class="font-display text-4xl md:text-5xl font-extrabold text-white">
            The SafiStore Protocol
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (feature of features; track feature.title; let i = $index) {
            <div 
              [appReveal]="i * 0.1"
              class="group p-8 bg-brand-dark/40 border border-white/5 rounded-[24px] hover:border-brand-blue/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div class="w-14 h-14 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-8 group-hover:bg-brand-blue/20 group-hover:scale-110 transition-all">
                <span class="text-brand-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="feature.icon" />
                  </svg>
                </span>
              </div>
              <h3 class="font-display text-xl text-white mb-3">{{ feature.title }}</h3>
              <p class="text-[14px] text-brand-muted leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          }
        </div>

      </div>
    </section>
  `
})
export class ProtocolComponent {
  features = [
    {
      title: 'Neural Logistics',
      description: 'Ultra-fast delivery network powered by predictive analytics and automated routing for zero-delay fulfillment.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      title: 'Encrypted Ledger',
      description: 'Your transactions and data are protected by military-grade encryption and secure decentralized verification.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    {
      title: 'Protocol Revival',
      description: 'Our lifetime support and upgrade programs ensure your premium hardware stays ahead of the curve.',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    },
    {
      title: 'Prime Direct',
      description: 'Exclusive first access to limited drops and prototype hardware for SafiStore verified members.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-7.714L1 12l6.857-2.143L11 3z'
    }
  ];
}
