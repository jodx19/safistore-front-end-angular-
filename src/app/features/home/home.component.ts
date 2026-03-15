import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './sections/hero/hero.component';
import { CategoryFilterComponent } from './sections/category-filter/category-filter.component';
import { FeaturedProductsComponent } from './sections/featured-products/featured-products.component';
import { ProtocolComponent } from './sections/protocol/protocol.component';
import { MetricsComponent } from './sections/metrics/metrics.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { CtaBannerComponent } from './sections/cta-banner/cta-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    CategoryFilterComponent,
    FeaturedProductsComponent,
    ProtocolComponent,
    MetricsComponent,
    TestimonialsComponent,
    CtaBannerComponent
  ],
  template: `
    <div class="home-container">
      <app-hero></app-hero>
      <app-category-filter></app-category-filter>
      
      @defer (on viewport) {
        <app-featured-products></app-featured-products>
      } @placeholder {
        <div class="h-96 bg-brand-navy"></div>
      }

      @defer (on viewport) {
        <app-protocol></app-protocol>
      } @placeholder {
        <div class="h-96 bg-brand-navy"></div>
      }

      @defer (on viewport) {
        <app-metrics></app-metrics>
      } @placeholder {
        <div class="h-48 bg-brand-navy"></div>
      }

      @defer (on viewport) {
        <app-testimonials></app-testimonials>
      } @placeholder {
        <div class="h-96 bg-brand-navy"></div>
      }

      @defer (on viewport) {
        <app-cta-banner></app-cta-banner>
      } @placeholder {
        <div class="h-96 bg-brand-navy"></div>
      }
    </div>
  `
})
export class HomeComponent {}
