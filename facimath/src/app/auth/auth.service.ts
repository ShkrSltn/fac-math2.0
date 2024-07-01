import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const url = `http://localhost:8080/login?login=${email}&password=${password}`;
    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    return this.http.get(url, { headers }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/home']);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  removeUsername(): void {
    localStorage.removeItem('username');
  }

  // Метод для регистрации нового пользователя
  register(
    firstName: string,
    lastName: string,
    login: string,
    password: string
  ): Observable<any> {
    const url = `http://localhost:8080/registration`;
    console.log('Register URL:', url); // Добавьте логирование URL
    const body = { firstName, lastName, login, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, body, { headers });
  }

  addAuthHeader(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
