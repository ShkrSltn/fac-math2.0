import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule],
  providers: [AuthService],
})
export class LoginComponent {
  loginData = { login: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.valid) {
      this.authService
        .login(this.loginData.login, this.loginData.password)
        .subscribe(
          (response) => {
            console.log('Успешная авторизация', response);
            if (response && response.token) {
              this.authService.setToken(response.token);
              this.authService.setUsername(this.loginData.login); // Сохранение логина
              this.router.navigate(['/home']);
            }
          },
          (error) => {
            console.log('Ошибка авторизации', error);
          }
        );
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
