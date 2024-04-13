import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/user/profile']);
        }
        return !isLoggedIn;
      })
    );
  }
}
