
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  isAuthPage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthPage(this.router.url);
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkAuthPage(event.url);
    });
  }

  checkAuthPage(url: string) {
    this.isAuthPage = url === '/login' || url === '/register';
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
