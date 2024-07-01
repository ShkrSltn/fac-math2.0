import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgClass, RouterModule],
  providers: [AuthService],
})
export class RegisterComponent {
  registerData = { firstName: '', lastName: '', login: '', password: '' };
  registrationError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(form: NgForm) {
    if (form.valid) {
      this.authService
        .register(
          this.registerData.firstName,
          this.registerData.lastName,
          this.registerData.login,
          this.registerData.password
        )
        .subscribe(
          (response) => {
            console.log('Successful registration', response);
            this.authService
              .login(this.registerData.login, this.registerData.password)
              .subscribe(
                (loginResponse) => {
                  if (loginResponse && loginResponse.token) {
                    this.authService.setToken(loginResponse.token);
                    this.authService.setUsername(this.registerData.login);
                    this.router.navigate(['/home']);
                  }
                },
                (loginError) => {
                  console.log('Login error after registration', loginError);
                }
              );
          },
          (error) => {
            console.log('Registration error', error);
            if (error.status === 409) {
              this.registrationError = 'A user with this login already exists';
            } else {
              this.registrationError = 'A user with this login already exists ';
            }
          }
        );
    }
  }
}
