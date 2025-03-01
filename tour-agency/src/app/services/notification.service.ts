import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all notifications for the current user
   */
  getUserNotifications(): Observable<Notification[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Get unread notifications for the current user
   */
  getUnreadNotifications(): Observable<Notification[]> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}/unread`);
  }

  /**
   * Mark a notification as read
   * @param notificationId ID of the notification to mark as read
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read for the current user
   */
  markAllAsRead(): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    return this.http.put<void>(`${this.apiUrl}/user/${userId}/read-all`, {});
  }

  /**
   * Get the count of unread notifications
   */
  getUnreadCount(): Observable<{ count: number }> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<{ count: number }>(`${this.apiUrl}/user/${userId}/unread-count`);
  }
}
