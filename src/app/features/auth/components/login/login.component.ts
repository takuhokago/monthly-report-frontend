import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.dto';
import { LoginResponse } from '../../models/login-response.dto';
import { switchMap, finalize, delay } from 'rxjs/operators';

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
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading = true;
    const loginData: LoginRequest = {
      code: this.code,
      password: this.password,
    };

    this.authService
      .login(loginData)
      .pipe(
        switchMap(() => this.authService.fetchMe()), // ログイン成功後にme取得
        finalize(() => (this.loading = false)), // 成功でも失敗でも最後に必ずfalse
      )
      .subscribe({
        next: (user) => {
          console.log('ログインユーザー:', user);
          this.router.navigate(['/reports']);
        },
        error: (err) => {
          console.error(err);
          // login失敗 / fetchMe失敗どちらでもここに来る
          this.errorMessage =
            'ログインに失敗しました。社員番号またはパスワードを確認してください。';
        },
      });
  }
}
