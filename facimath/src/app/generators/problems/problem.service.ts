import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProblemGeneratorService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  generateProblem(operation: string, min: number, max: number): string {
    if (min > max) {
      throw new Error('Minimum value cannot be greater than maximum value');
    }

    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;

    switch (operation) {
      case 'sum':
        return `${a} + ${b}`;
      case 'subt':
        if (a < b) [a, b] = [b, a];
        return `${a} − ${b}`;
      case 'mult':
        return `${a} × ${b}`;
      case 'div':
        while (b === 0 || a % b !== 0) {
          a = Math.floor(Math.random() * (max - min + 1)) + min;
          b = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return `${a} ÷ ${b}`;
      case 'comp':
        return `${a} ⋛ ${b}`;
      default:
        return '';
    }
  }

  /**
   * The generateProblems function generates an array of strings, each representing a math problem.
   *
   * @param {string} operation - The operation to be used for generating problems (e.g., 'sum', 'subt', 'mult', 'div', 'comp').
   * @param {number} min - The minimum value for the numbers used in the problems.
   * @param {number} max - The maximum value for the numbers used in the problems.
   * @param {number} count - The number of problems to generate.
   * @returns {string[]} - An array of strings, each representing a math problem.
   */
  generateProblems(
    operation: string,
    min: number,
    max: number,
    count: number
  ): string[] {
    if (count > 80) {
      throw new Error('The number of problems cannot exceed 80');
    }

    const problems = [];
    for (let i = 0; i < count; i++) {
      problems.push(this.generateProblem(operation, min, max));
    }
    return problems;
  }

  generateMixedProblems(min: number, max: number, count: number): string[] {
    const operations = ['sum', 'subt', 'mult', 'div', 'comp'];
    const problems = [];
    for (let i = 0; i < count; i++) {
      const randomOperation =
        operations[Math.floor(Math.random() * operations.length)];
      problems.push(this.generateProblem(randomOperation, min, max));
    }
    return problems;
  }

  private calculateCorrectAnswer(problem: string): number {
    const [a, operator, b] = problem.split(' ');
    const numA = parseInt(a);
    const numB = parseInt(b);

    switch (operator) {
      case '=':
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

  saveProblems(payload: any): Observable<any> {
    const url = 'http://localhost:8080/add/test';
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = this.authService.addAuthHeader(headers);

    const text = JSON.stringify({
      operation: payload.operation,
      result: payload.result,
      problems: payload.problems,
      timestamp: payload.timestamp,
    });

    const newPayload = { text };
    return this.http.post(url, newPayload, { headers });
  }

  getProblemHistory(): Observable<any> {
    const url = 'http://localhost:8080/tests';
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = this.authService.addAuthHeader(headers);
    return this.http.get(url, { headers });
  }
}
