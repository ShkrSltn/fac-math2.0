import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavigationComponent,
    FooterComponent,
    RouterModule,
    NotificationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NotificationService],
})
export class HomeComponent {
  username: string | null = null;
  activeRoute: string = '/home';

  homeNavItems = [
    {
      path: '../problems',
      label: 'Math problems',
      icon: 'about-us-svgrepo-com.svg',
    },
    {
      path: '../history',
      label: 'Problems History',
      icon: 'history-svgrepo-com.svg',
    },
    { path: '#welcome', label: 'About us', icon: 'about-us-svgrepo-com.svg' },
    {
      path: decodeURI('#functions'),
      label: 'Functions',
      icon: 'functions-svgrepo-com.svg',
    },
    { path: '#', label: 'Contacts', icon: 'contacts-svgrepo-com.svg' },
  ];

  constructor(private authService: AuthService) {
    this.username = this.authService.getUsername();
    this.decodeNavItems();
  }

  decodeNavItems() {
    this.homeNavItems = this.homeNavItems.map((item) => ({
      ...item,
      path: decodeURIComponent(item.path),
    }));
  }

  logout() {
    this.authService.logout();
  }
}
