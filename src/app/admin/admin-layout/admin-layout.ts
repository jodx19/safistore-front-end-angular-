import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent implements OnInit {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = '';
  
  adminInitial: string = 'A';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.firstName) {
        this.adminInitial = user.firstName.charAt(0).toUpperCase();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
