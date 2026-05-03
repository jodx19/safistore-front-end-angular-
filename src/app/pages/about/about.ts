import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, RevealDirective],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent implements OnInit {
  stats = [
    { value: '50K+', label: 'Happy Customers', icon: '👥' },
    { value: '200K+', label: 'Products Delivered', icon: '📦' },
    { value: '99.9%', label: 'Uptime Guaranteed', icon: '⚡' },
    { value: '5★', label: 'Average Rating', icon: '⭐' }
  ];

  team = [
    { name: 'Alex Carter', role: 'CEO & Co-Founder', avatar: 'AC', gradient: 'from-brand-blue to-brand-purple', social: { twitter: '#', linkedin: '#' } },
    { name: 'Sara Mitchell', role: 'CTO & Lead Engineer', avatar: 'SM', gradient: 'from-purple-500 to-pink-500', social: { twitter: '#', linkedin: '#' } },
    { name: 'Omar Hassan', role: 'Head of Design', avatar: 'OH', gradient: 'from-cyan-500 to-brand-blue', social: { twitter: '#', linkedin: '#' } },
    { name: 'Lena Müller', role: 'Head of Operations', avatar: 'LM', gradient: 'from-emerald-500 to-teal-500', social: { twitter: '#', linkedin: '#' } },
    { name: 'James Wu', role: 'Lead Data Scientist', avatar: 'JW', gradient: 'from-orange-500 to-red-500', social: { twitter: '#', linkedin: '#' } },
    { name: 'Priya Sharma', role: 'Customer Success Lead', avatar: 'PS', gradient: 'from-violet-500 to-purple-500', social: { twitter: '#', linkedin: '#' } }
  ];

  milestones = [
    { year: '2020', title: 'The Genesis', description: 'SafiStore was founded with a vision to democratize access to premium tech products.' },
    { year: '2021', title: 'First 1,000 Customers', description: 'Reached our first major milestone with customers spanning 15 countries.' },
    { year: '2022', title: 'Series A Funding', description: 'Secured $5M in funding to expand our product catalog and infrastructure.' },
    { year: '2023', title: 'Global Expansion', description: 'Launched international shipping to 50+ countries with same-day delivery in major cities.' },
    { year: '2024', title: 'AI-Powered Platform', description: 'Introduced AI-driven recommendations and a revolutionary checkout experience.' },
    { year: '2025', title: 'The Future', description: 'Continuing to push boundaries with AR product previews and zero-latency global fulfillment.' }
  ];

  values = [
    { icon: '🔐', title: 'Security First', description: 'Every transaction is protected with military-grade encryption and multi-factor authentication protocols.' },
    { icon: '⚡', title: 'Lightning Fast', description: 'Our distributed CDN ensures sub-100ms load times across the globe, 24/7.' },
    { icon: '🌍', title: 'Globally Accessible', description: 'Serving customers in 50+ countries with localized experiences and competitive pricing.' },
    { icon: '♻️', title: 'Sustainable Impact', description: 'Carbon-neutral shipping and eco-friendly packaging as our commitment to the planet.' }
  ];

  email = '';
  subscribeSuccess = false;

  ngOnInit(): void {}

  onSubscribe(): void {
    if (this.email && this.email.includes('@')) {
      this.subscribeSuccess = true;
      this.email = '';
      setTimeout(() => this.subscribeSuccess = false, 4000);
    }
  }
}
