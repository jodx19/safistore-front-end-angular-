import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class LandingComponent implements AfterViewInit {
  currentYear: number = new Date().getFullYear();
  activeCategory: string = 'All';
  showToast: boolean = false;
  toastMessage: string = '';

  categories = ['All', 'Audio', 'Wearables', 'Accessories'];

  featuredProducts = [
    { name: 'Air Force Premium', category: 'Audio', price: 129, oldPrice: 159, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', discount: '20% OFF' },
    { name: 'Quantum Watch Ultra', category: 'Wearables', price: 799, oldPrice: 949, rating: 5.0, reviews: 342, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', discount: '15% OFF' },
    { name: 'Sonic Fidelity X1', category: 'Audio', price: 348, oldPrice: null, rating: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', discount: null },
    { name: 'Focus Lens Aviator', category: 'Accessories', price: 154, oldPrice: 199, rating: 4.5, reviews: 56, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', discount: 'Sale' }
  ];

  get filteredProducts() {
    if (this.activeCategory === 'All') return this.featuredProducts;
    return this.featuredProducts.filter(p => p.category === this.activeCategory);
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
  }

  stats = { users: 0, protocols: 0, stability: 0 };
  statsStarted = false;

  testimonials = [
    { quote: "Amazing quality and lightning-fast delivery. Couldn't be happier.", author: "Muhammed Mobaruk", initial: "M" },
    { quote: "Best shopping experience ever. Exceptional service protocol.", author: "Berlin", initial: "B" },
    { quote: "Great prices and variety. Everything I needed in one place.", author: "Nowdzawy", initial: "N" }
  ];
  currentTestimonial = 0;

  addToCart(productName: string) {
    this.toastMessage = `${productName} added to cart!`;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  startCounters() {
    if (this.statsStarted) return;
    this.statsStarted = true;
    
    const animateValue = (prop: string, start: number, end: number, duration: number, isFloat: boolean = false) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        if (isFloat) {
           (this.stats as any)[prop] = (progress * (end - start) + start).toFixed(1);
        } else {
           (this.stats as any)[prop] = Math.floor(progress * (end - start) + start);
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
    
    animateValue('users', 0, 50, 2000);
    animateValue('protocols', 0, 200, 2000);
    animateValue('stability', 80, 99.9, 2000, true);
  }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonial = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
  }

  setTestimonial(index: number) {
    this.currentTestimonial = index;
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.scroll-fade');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stats-section')) {
               this.startCounters();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
  }

  goToStartShopping(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
