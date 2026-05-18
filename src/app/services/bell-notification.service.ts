import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { NotificationClient, NotificationDto } from '../api-client/api-client';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BellNotificationService implements OnDestroy {
  private _notifications = new BehaviorSubject<NotificationDto[]>([]);
  private _unreadCount = new BehaviorSubject<number>(0);
  private _pollingSub?: Subscription;

  readonly notifications$ = this._notifications.asObservable();
  readonly unreadCount$ = this._unreadCount.asObservable();

  constructor(
    private notificationClient: NotificationClient,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.startPolling();
      } else {
        this.stopPolling();
        this._notifications.next([]);
        this._unreadCount.next(0);
      }
    });
  }

  private startPolling() {
    this.stopPolling();
    this._pollingSub = interval(30000)
      .pipe(
        switchMap(() => this.notificationClient.getNotifications()),
        tap(resp => {
          this._notifications.next(resp.data);
          this._unreadCount.next(resp.unreadCount);
        })
      )
      .subscribe();
    // Also fetch immediately
    this.notificationClient.getNotifications().subscribe(resp => {
      this._notifications.next(resp.data);
      this._unreadCount.next(resp.unreadCount);
    });
  }

  private stopPolling() {
    this._pollingSub?.unsubscribe();
    this._pollingSub = undefined;
  }

  markAsRead(id: number) {
    this.notificationClient.markAsRead(id).subscribe(() => {
      const current = this._notifications.value.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      );
      this._notifications.next(current);
      this._unreadCount.next(current.filter(n => !n.isRead).length);
    });
  }

  markAllAsRead() {
    this.notificationClient.markAllAsRead().subscribe(() => {
      const current = this._notifications.value.map(n => ({ ...n, isRead: true }));
      this._notifications.next(current);
      this._unreadCount.next(0);
    });
  }

  ngOnDestroy() {
    this.stopPolling();
  }
}
