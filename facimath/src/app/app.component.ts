import { Component } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './notification.service';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AuthService, NotificationService],
  imports: [
    RouterOutlet,
    RegisterComponent,
    LoginComponent,
    NotificationComponent,
  ],
})
export class AppComponent {
  title = 'facimath';
  currentRoute: string | undefined;
  username: string | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }
}
