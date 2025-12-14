import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  private notificationIdCounter = 0;

  constructor() {
    // Initialize with empty array
    this.notificationsSubject.next([]);
  }

  /**
   * Show a success notification
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error notification
   */
  showError(message: string, duration: number = 4000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show an info notification
   */
  showInfo(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Show a warning notification
   */
  showWarning(message: string, duration: number = 3500): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Internal method to show a notification
   */
  private show(message: string, type: Notification['type'], duration: number): void {
    const notification: Notification = {
      id: ++this.notificationIdCounter,
      message,
      type,
      duration
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  /**
   * Remove a notification by ID
   */
  remove(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notificationsSubject.next([]);
  }
}

