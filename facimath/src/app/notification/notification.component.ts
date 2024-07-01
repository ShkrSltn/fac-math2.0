import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string = '';
  type: 'success' | 'error' | 'info' = 'info';
  show: boolean = false;
  private subscription: Subscription | undefined;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      (notification) => {
        console.log('Получено уведомление:', notification);
        this.message = notification.message;
        this.type = notification.type;
        this.show = true;
        setTimeout(() => (this.show = false), 3000);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
