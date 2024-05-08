import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService) { }
  canLoad(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.authService.logout();
        }
      })
    );
  }
}
