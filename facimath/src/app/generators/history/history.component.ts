import { Component } from '@angular/core';
import { ProblemGeneratorService } from '../problems/problem.service';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../navigation/navigation.component';
import { AuthService } from '../../auth/auth.service'; // Import the AuthService

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NavigationComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  problemHistory: any[] = []; // Initialized as an empty array
  username: string | null = null; // Added username property
  activeRoute: string = '/history'; // Added activeRoute property

  constructor(
    private problemGeneratorService: ProblemGeneratorService,
    private authService: AuthService
  ) {
    // Inject the AuthService
    this.username = this.authService.getUsername(); // Set the username
  }

  ngOnInit() {
    this.loadProblemHistory();
  }

  loadProblemHistory() {
    this.problemGeneratorService.getProblemHistory().subscribe(
      (history) => {
        console.log('Received history:', history);
        this.problemHistory = history.map((entry: any) => {
          try {
            const parsedText = JSON.parse(entry.text);
            return {
              ...parsedText,
              id: entry.id,
            };
          } catch (error) {
            console.error('Error parsing JSON:', error);
            return {
              id: entry.id,
              text: entry.text,
              operation: 'Unknown',
              result: 'N/A',
              problems: [],
              timestamp: new Date().toISOString(),
            };
          }
        });
      },
      (error) => {
        console.error('Error loading problem history', error);
      }
    );
  }

  toggleCorrectAnswer(problem: any) {
    if (problem.userAnswer !== problem.correctAnswer) {
      problem.showCorrectAnswer = !problem.showCorrectAnswer;
    }
  }

  getOperationName(operation: string): string {
    switch (operation) {
      case 'sum':
        return 'Addition';
      case 'subt':
        return 'Subtraction';
      case 'mult':
        return 'Multiplication';
      case 'div':
        return 'Division';
      case 'comp':
        return 'Comparison';
      default:
        return operation;
    }
  }

  historyNav = [
    {
      path: '../problems',
      label: 'Math problems',
      icon: 'about-us-svgrepo-com.svg',
    },
    {
      path: '/history',
      label: 'Problems History',
      icon: 'history-svgrepo-com.svg',
    },
    {
      path: '/navigation',
      label: 'Navigation',
      icon: 'navigation-svgrepo-com.svg',
    },
  ];
}
