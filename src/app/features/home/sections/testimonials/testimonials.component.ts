import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 px-6 overflow-hidden">
      <div class="max-w-[1200px] mx-auto">
        
        <div class="mb-16">
          <span appReveal class="block text-[11px] font-semibold text-brand-blue tracking-[0.3em] uppercase mb-4">
            TRANSMISSION LOGS
          </span>
          <h2 [appReveal]="0.1" class="font-display text-4xl md:text-5xl font-extrabold text-white">
            What Our Members Say
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (item of testimonials; track item.name; let i = $index) {
            <div 
              [appReveal]="i * 0.1"
              class="relative p-8 bg-brand-dark/50 border border-white/5 rounded-[24px] hover:border-brand-blue/20 hover:-translate-y-1 transition-all duration-300 group"
            >
              <!-- Quote Mark -->
              <div class="absolute -top-4 -left-4 w-10 h-10 bg-brand-blue/10 border border-brand-blue/20 rounded-xl flex items-center justify-center text-brand-blue text-2xl font-serif">
                "
              </div>

              <div class="mb-6">
                <div class="flex text-brand-blue gap-1 mb-1">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>

              <p class="text-[15px] text-brand-white/70 italic leading-relaxed mb-8">
                "{{ item.text }}"
              </p>

              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-brand-blue/20 border border-brand-blue/30 overflow-hidden">
                  <div class="w-full h-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold">
                    {{ item.name.charAt(0) }}
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white">{{ item.name }}</h4>
                  <p class="text-[11px] text-brand-muted uppercase tracking-wider">{{ item.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Berlin',
      role: 'Beta Tester',
      text: 'The Catalyst series has redefined my expectations for wearables. The performance is unparalleled, and the build quality feels truly futuristic.'
    },
    {
      name: 'Elfnan',
      role: 'Tech Lead',
      text: 'Incredible experience from order to delivery. The neural logistics system is no joke—my Titan Spectre arrived 2 days earlier than expected.'
    },
    {
      name: 'Nodzawy',
      role: 'Early Adopter',
      text: 'Joining the SafiStore elite was the best decision for my workflow. The exclusive access and support are worth every penny.'
    }
  ];
}
