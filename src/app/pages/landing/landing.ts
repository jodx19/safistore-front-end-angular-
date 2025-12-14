import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class LandingComponent implements AfterViewInit {
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private authService: AuthService) {}

  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.scroll-fade');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
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
