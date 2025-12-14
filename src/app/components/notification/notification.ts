import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeNotification(id: number) {
    this.notificationService.remove(id);
  }

  getNotificationClass(type: string): string {
    const baseClasses = 'px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center justify-between min-w-[300px] max-w-[500px]';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-l-4 border-green-500 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-l-4 border-red-500 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-l-4 border-blue-500 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-l-4 border-gray-500 text-gray-800`;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }
}

