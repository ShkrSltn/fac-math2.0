import {
  Component,
  Input,
  OnInit,
  Renderer2,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemGeneratorService } from '../problems/problem.service';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from '../../navigation/navigation.component';
import { RouterModule } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NotificationService } from '../../notification.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-problem-list',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss'],
  standalone: true,
  imports: [FormsModule, NavigationComponent, RouterModule],
  providers: [NotificationService],
})
export class ProblemsComponent implements OnInit {
  @Input() operation: string = 'sum';
  @Input() min: number = 1;
  @Input() max: number = 10;
  @Input() count: number = 20;
  problems: string[] = [];
  color: string = '#000000';
  allFieldsFilled: boolean = false;
  allProblemsSolved: boolean = false;
  answers: (number | null)[] = [];
  showCheckButton: boolean = false;
  showGenerateNewButton: boolean = false;
  correctAnswersCount: number = 0;
  activeRoute: string = '/problems';
  motivationalMessage: string = '';

  colorMap: { [key: string]: string } = {
    sum: '#47CEAC',
    subt: '#FFCD54',
    mult: '#D670AD',
    div: '#FA6E51',
    comp: '#74A4E3',
    mixed: '#4A5A67',
  };

  constructor(
    private problemGeneratorService: ProblemGeneratorService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.operation = params['operation'] || 'sum';
      this.color = this.colorMap[this.operation] || '#000000';
      this.applyColor(this.color);
    });

    // Удаляем автоматическую генерацию задач
    // if (!this.route.snapshot.params['operation']) {
    //   this.generateProblems();
    // }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.problems.length > 0 && !this.allProblemsSolved) {
      $event.returnValue = true;
    }
  }

  applyColor(color: string): void {
    const textElements = document.querySelectorAll(
      '#myForm label, #myForm input, #myForm input::placeholder'
    );
    textElements.forEach((element) => {
      this.renderer.setStyle(element, 'color', color);
      this.renderer.setStyle(element, 'placeholder-color', color);
    });
    /*    const inputElements = document.querySelectorAll('#myForm button');
    inputElements.forEach((element) => {
      this.renderer.setStyle(element, 'border-color', color);
      this.renderer.listen(element, 'mouseover', () => {
        this.renderer.setStyle(element, 'background-color', color);
      });
      this.renderer.listen(element, 'mouseout', () => {
        this.renderer.removeStyle(element, 'background-color');
      });
    }); */
  }

  generateProblems(): void {
    if (this.problems.length > 0 && !this.allProblemsSolved) {
      if (
        !confirm(
          'Are you sure you want to generate new problems? Current progress will be lost.'
        )
      ) {
        return;
      }
    }
    if (this.operation === 'mixed') {
      this.problems = this.problemGeneratorService.generateMixedProblems(
        this.min,
        this.max,
        this.count
      );
    } else {
      this.problems = this.problemGeneratorService.generateProblems(
        this.operation,
        this.min,
        this.max,
        this.count
      );
    }
    this.allProblemsSolved = false;
    this.answers = new Array(this.problems.length).fill(null);
    this.allFieldsFilled = false;
    this.showCheckButton = false;
    this.showGenerateNewButton = false;
    this.correctAnswersCount = 0;
    this.motivationalMessage = '';

    // Очистка полей ввода и установка состояния
    setTimeout(() => {
      const inputs = document.querySelectorAll(
        '.answer-input'
      ) as NodeListOf<HTMLInputElement>;
      inputs.forEach((input, index) => {
        input.value = '';
        input.style.backgroundColor = '';
        input.disabled = index !== 0; // Разблокируем только первое поле
      });
      this.checkAllFieldsFilled(); // Проверяем состояние полей
    }, 0);
  }

  addClickedClass(event: Event) {
    const target = event.target as HTMLElement;
    const allElements = document.querySelectorAll('.clicked');
    allElements.forEach((element) => {
      element.classList.remove('clicked');
    });
    target.classList.add('clicked');
  }

  checkAndSave(): void {
    const inputs = document.querySelectorAll(
      '.answer-input'
    ) as NodeListOf<HTMLInputElement>;
    let allCorrect = true;
    this.correctAnswersCount = 0;

    this.answers = Array.from(inputs).map((input) => {
      const userAnswer = parseInt(input.value);
      if (isNaN(userAnswer)) {
        return null;
      }
      return userAnswer;
    });

    inputs.forEach((input, index) => {
      const userAnswer = this.answers[index];
      const problem = this.problems[index];
      const correctAnswer = this.calculateCorrectAnswer(problem);

      if (userAnswer === correctAnswer) {
        input.style.backgroundColor = 'lightgreen';
        this.correctAnswersCount++;
      } else {
        input.style.backgroundColor = 'lightcoral';
        allCorrect = false;
      }

      input.disabled = true;
    });

    this.saveProblems();

    // Добавляем мотивирующее сообение
    const percentage = (this.correctAnswersCount / this.problems.length) * 100;

    if (percentage === 100) {
      this.motivationalMessage =
        "Incredible job! You're a math genius! Keep up the fantastic work!";
    } else if (percentage >= 80) {
      this.motivationalMessage =
        "Great work! You're making excellent progress. Keep pushing yourself!";
    } else if (percentage >= 60) {
      this.motivationalMessage =
        "Good effort! You're on the right track. With more practice, you'll be a math whiz in no time!";
    } else if (percentage >= 40) {
      this.motivationalMessage =
        "Nice try! Math can be challenging, but don't give up. Every mistake is a chance to learn and grow!";
    } else {
      this.motivationalMessage =
        "Don't be discouraged! Math takes time and practice. Believe in yourself and keep working hard. You've got this!";
    }

    // Disable the button after checking
    const checkButton = document.querySelector(
      '.check-button'
    ) as HTMLButtonElement;
    if (checkButton) {
      checkButton.disabled = true;
      checkButton.style.backgroundColor = 'gray';
    }

    this.showGenerateNewButton = true;
  }

  private saveProblems(): void {
    console.log('saveProblems вызван');
    if (this.problems.length > 0) {
      const result = `${this.correctAnswersCount}/${this.problems.length}`;
      const payload = {
        problems: this.problems.map((problem, index) => ({
          problem: problem,
          userAnswer: this.answers[index],
          correctAnswer: this.calculateCorrectAnswer(problem),
        })),
        result: result,
        operation: this.operation,
        timestamp: new Date().toISOString(),
      };
      this.problemGeneratorService.saveProblems(payload).subscribe(
        (response) => {
          console.log('Problems successfully saved', response);
          alert(`Problems successfully saved. Result: ${result}`);
        },
        (error) => {
          console.error('Error saving problems', error);
          alert('An error occurred while saving problems');
        }
      );
    } else {
      alert('No problems to save');
    }
  }

  generatePDF(event: Event): void {
    event.preventDefault();
    const currentDate = new Date().toLocaleDateString();
    const docDefinition: any = {
      content: [
        {
          text: 'Mathematical Adventure!',
          style: 'header',
          alignment: 'center',
          color: '#4CAF50',
        },
        {
          text: 'by facimath.com',
          alignment: 'right',
          fontSize: 10,
          margin: [0, 0, 0, 5],
          color: '#2196F3',
        },
        {
          text: currentDate,
          alignment: 'right',
          fontSize: 10,
          margin: [0, 0, 0, 10],
          color: '#2196F3',
        },
        {
          text: 'Hello, young mathematician! Ready for some fun problems?',
          style: 'subheader',
          margin: [0, 0, 0, 10],
          color: '#FF9800',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'Problem', style: 'tableHeader', color: '#E91E63' },
                { text: 'Your Answer', style: 'tableHeader', color: '#9C27B0' },
                {
                  text: 'Correct Answer',
                  style: 'tableHeader',
                  color: '#009688',
                },
              ],
              ...this.problems.map((problem, index) => [
                { text: problem, color: '#3F51B5', alignment: 'center' },
                '',
                { text: '?', color: '#FF5722', alignment: 'center' },
              ]),
            ],
          },
        },
        {
          text: 'Good luck! You can do it!',
          style: 'encouragement',
          alignment: 'center',
          margin: [0, 20, 0, 0],
          color: '#4CAF50',
        },
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          alignment: 'center',
        },
        encouragement: {
          fontSize: 18,
          bold: true,
          italics: true,
        },
      },
      defaultStyle: {
        fontSize: 12,
      },
    };

    pdfMake.createPdf(docDefinition).download('math_adventure.pdf');
  }

  checkAllFieldsFilled(): void {
    const inputs = document.querySelectorAll(
      '.answer-input'
    ) as NodeListOf<HTMLInputElement>;
    this.allFieldsFilled = Array.from(inputs).every(
      (input, index) => !input.disabled && input.value.trim() !== ''
    );
    this.showCheckButton = this.allFieldsFilled;
    this.allProblemsSolved = this.allFieldsFilled;
  }

  checkAnswer(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const userAnswer = input.value.trim() === '' ? null : parseInt(input.value);
    const problem = this.problems[index];
    const correctAnswer = this.calculateCorrectAnswer(problem);

    this.answers[index] = userAnswer;
    this.checkAllFieldsFilled();

    // Разблокируем следующее поле, если текущее заполнено
    if (userAnswer !== null && index < this.problems.length - 1) {
      const nextInput = document.querySelector(
        `[data-problem-index="${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.disabled = false;
      }
    }
  }

  isAnswered(index: number): boolean {
    return this.answers[index] !== null && this.answers[index] !== undefined;
  }

  private calculateCorrectAnswer(problem: string): number {
    const [a, operator, b] = problem.split(' ');
    const numA = parseInt(a);
    const numB = parseInt(b);

    switch (operator) {
      case '+':
        return numA + numB;
      case '−':
        return numA - numB;
      case '×':
        return numA * numB;
      case '÷':
        return numA / numB;
      case '⋛':
        return Math.max(numA, numB);
      default:
        return NaN;
    }
  }

  onInputKeyPress(event: KeyboardEvent): void {
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  generators = [
    {
      path: '/problems',
      label: 'Math problems',
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
