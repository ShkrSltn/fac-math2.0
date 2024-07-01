import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @Input() navItems: NavItem[] = [];
  @Input() showLogout: boolean = true;
  @Input() activeRoute: string = '';

  isMenuOpen = false;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  encodeURIComponent(path: string): string {
    return encodeURIComponent(path);
  }

  isAnchor(path: string): boolean {
    return path.includes('#') ? true : false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setActiveRoute(path: string) {
    this.activeRoute = path;
  }
}
