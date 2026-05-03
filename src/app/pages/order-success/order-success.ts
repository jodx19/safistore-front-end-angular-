import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccessComponent implements OnInit, OnDestroy {
  orderNumber = '';
  customerEmail = '';
  estimatedDelivery = '';
  confettiParticles: { x: number; y: number; color: string; size: number; rotation: number; speed: number }[] = [];
  showCheck = false;
  private confettiInterval: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Generate order number
    const randomId = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `SAF-2025-${randomId}`;

    // Get from query params if available
    this.route.queryParams.subscribe(params => {
      if (params['orderNumber']) this.orderNumber = params['orderNumber'];
      if (params['email']) this.customerEmail = params['email'];
    });

    // Set estimated delivery (5-7 business days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    this.estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Trigger check animation
    setTimeout(() => this.showCheck = true, 300);

    // Launch confetti
    this.launchConfetti();
  }

  ngOnDestroy(): void {
    if (this.confettiInterval) clearInterval(this.confettiInterval);
  }

  launchConfetti(): void {
    const colors = ['#6C4FF6', '#3B82F6', '#22D3EE', '#10B981', '#F59E0B', '#EC4899', '#ffffff'];
    this.confettiParticles = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      speed: 1 + Math.random() * 2
    }));

    // Animate confetti falling
    let tick = 0;
    this.confettiInterval = setInterval(() => {
      tick++;
      this.confettiParticles = this.confettiParticles.map(p => ({
        ...p,
        y: p.y + p.speed,
        rotation: p.rotation + 3
      })).filter(p => p.y < 110);

      if (tick > 120 || this.confettiParticles.length === 0) {
        clearInterval(this.confettiInterval);
      }
    }, 30);
  }

  goToTrack(): void {
    this.router.navigate(['/track'], { queryParams: { order: this.orderNumber } });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  copyOrderNumber(): void {
    navigator.clipboard.writeText(this.orderNumber).then(() => {
      // could trigger a toast — for now, just a visual cue
    });
  }
}
