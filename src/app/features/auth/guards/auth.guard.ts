import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService
      .isLoggedIn()
      .pipe(
        map((isLoggedIn) =>
          isLoggedIn ? true : this.router.createUrlTree(['/login'])
        )
      );
  }
}
