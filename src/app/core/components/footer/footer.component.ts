import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-[#060e1a] border-t border-brand-border pt-20 pb-10">
      <div class="max-w-[1200px] mx-auto px-6">
        
        <!-- Top Section: Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          <!-- Col 1: Brand -->
          <div class="flex flex-col gap-6">
            <a routerLink="/" class="flex items-center gap-3">
              <div class="w-[10px] h-[10px] rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple shadow-glow"></div>
              <div class="font-display text-[22px] text-white">
                <span class="font-normal opacity-90">Safi</span>
                <span class="font-bold">Store</span>
              </div>
            </a>
            <p class="text-brand-muted text-[14px] leading-relaxed max-w-[240px]">
              Elevate your lifestyle with our premium selection of tech-forward products. Crafting excellence since 2024.
            </p>
            <div class="flex items-center gap-3">
              <a href="#" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-brand-blue hover:to-brand-purple transition-all group">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.92 2.203-4.92 4.917 0 .39.044.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.732-.672 1.583-.672 2.497 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.697 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.379 4.6 3.419-1.685 1.319-3.809 2.105-6.115 2.105-.397 0-.79-.023-1.175-.067 2.179 1.397 4.768 2.212 7.548 2.212 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-brand-blue hover:to-brand-purple transition-all group">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.149.26-2.911.557-.788.306-1.456.714-2.122 1.38S.869 3.23.563 4.018c-.297.762-.5 1.634-.557 2.911-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.26 2.149.557 2.911.306.788.714 1.456 1.38 2.122s1.336 1.074 2.122 1.38c.762.297 1.634.5 2.911.557 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.149-.26 2.911-.557.788-.306 1.456-.714 2.122-1.38s1.074-1.336 1.38-2.122c.297-.762.5-1.634.557-2.911.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.277-.26-2.149-.557-2.911-.306-.788-.714-1.456-1.38-2.122s-1.336-1.074-2.122-1.38c-.762-.297-1.634-.5-2.911-.557-1.28-.058-1.688-.072-4.947-.072z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zM18.406 3.506a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-brand-blue hover:to-brand-purple transition-all group">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          <!-- Col 2: Platform -->
          <div class="flex flex-col gap-6">
            <h4 class="text-[13px] font-semibold text-brand-white/30 tracking-[0.2em] uppercase">Platform</h4>
            <div class="flex flex-col gap-4">
              <a routerLink="/" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Storefront</a>
              <a routerLink="/products" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Collections</a>
              <a routerLink="/auth/login" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Member Access</a>
              <a href="#" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Protocol Docs</a>
            </div>
          </div>

          <!-- Col 3: Support -->
          <div class="flex flex-col gap-6">
            <h4 class="text-[13px] font-semibold text-brand-white/30 tracking-[0.2em] uppercase">Support</h4>
            <div class="flex flex-col gap-4">
              <a routerLink="/track-order" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Track Transmission</a>
              <a href="#" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Help Terminal</a>
              <a href="#" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Direct Support</a>
              <a href="#" class="text-[14px] text-brand-muted hover:text-white hover:translate-x-1 transition-all">Feedback Loop</a>
            </div>
          </div>

          <!-- Col 4: Newsletter -->
          <div class="flex flex-col gap-6">
            <h4 class="text-[13px] font-semibold text-brand-white/30 tracking-[0.2em] uppercase">Transmission</h4>
            <p class="text-[14px] text-brand-muted">Stay Intel-Ready with protocol updates.</p>
            <div class="flex h-11">
              <input type="email" placeholder="Email Address" 
                     class="flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 text-white text-[14px] focus:outline-none focus:border-brand-blue/50 transition-all">
              <button class="px-5 bg-gradient-to-tr from-brand-blue to-brand-purple rounded-r-xl text-white text-[14px] font-bold hover:brightness-110 active:scale-95 transition-all">
                Join
              </button>
            </div>
          </div>

        </div>

        <!-- Bottom Selection -->
        <div class="border-t border-brand-border pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p class="text-[13px] text-brand-white/20">© 2025 SafiStore Protocol. All rights reserved.</p>
          <div class="flex items-center gap-8">
            <a href="#" class="text-[13px] text-brand-white/20 hover:text-white transition-colors">Privacy</a>
            <a href="#" class="text-[13px] text-brand-white/20 hover:text-white transition-colors">Terms</a>
            <a href="#" class="text-[13px] text-brand-white/20 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
