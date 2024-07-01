import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { ProblemsComponent } from './problems/problems.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-generators',
  standalone: true,
  imports: [NavigationComponent, ProblemsComponent, RouterModule],
  templateUrl: './generators.component.html',
  styleUrl: './generators.component.scss',
})
export class GeneratorsComponent {
  activeRoute: string = '/generators';

  generatorItems = [
    {
      path: '/generators',
      label: 'Math generators',
      icon: 'about-us-svgrepo-com.svg',
    },
    {
      path: '/history',
      label: 'Problems History',
      icon: 'about-us-svgrepo-com.svg',
    },
    {
      path: '/navigation',
      label: 'Navigation',
      icon: 'navigation-svgrepo-com.svg',
    },
  ];
}
