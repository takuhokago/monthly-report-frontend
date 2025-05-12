import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.dto';
import { LoginResponse } from '../../models/login-response.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  code = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const loginData: LoginRequest = {
      code: this.code,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (res) => {
        // localStorage.setItem(...) は不要
        this.router.navigate(['/reports']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          'ログインに失敗しました。社員番号またはパスワードを確認してください。';
      },
    });
  }
}
