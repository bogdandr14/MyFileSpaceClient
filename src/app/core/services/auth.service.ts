import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ChangePasswordModel } from '../models/auth/change-password.model';
import { LoginModel } from '../models/auth/login.model';
import { RegisterModel } from '../models/auth/register.model';

import { BaseService } from './base.service';
import { DataService } from './data.service';
import { TokenModel } from '../models/auth/token.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  private timerSubscription = new Subscription();
  private isLoggedIn = new BehaviorSubject<boolean>(null);
  public isLoggedIn$ = this.isLoggedIn
    .asObservable()
    .pipe(filter((val) => val !== null));
  public isAdmin$ = this.dataService.user$.pipe(
    filter((val) => val !== null),
    map((user) => user.role === 'Admin')
  );
  constructor(
    public override http: HttpClient,
    private router: Router,
    private dataService: DataService
  ) {
    super(http, 'api/user');
    this.loadToken();
  }

  private loadToken() {
    this.dataService.getToken().subscribe((token) => {
      this.isLoggedIn.next(!!token);
      if (token) {
        this.setExpirationCounter(token);
      }
    });
  }

  public login(userCredentials: LoginModel): Observable<TokenModel> {
    return super.add<TokenModel>(userCredentials, 'login').pipe(
      tap((response) => {
        this.dataService.setToken(response.token);
        this.setUserInfo(response.token);
        this.isLoggedIn.next(true);
        this.router.navigate(['folder', 'inbox']);
      })
    );
  }

  public register(registerDetails: RegisterModel): Observable<void> {
    return super.add<void>(registerDetails, 'register');
  }

  public changePassword(changePassword: ChangePasswordModel) {
    return super.update<void>(changePassword, 'changePassword');
  }

  public logout(): void {
    this.timerSubscription.unsubscribe();
    this.dataService.removeToken();
    this.dataService.removeCurrentUser();
    this.isLoggedIn.next(false);
    this.router.navigate(['user', 'login']);
  }

  private setUserInfo(token: string) {
    const tokenInfo = JSON.parse(atob(token.split('.')[1]));
    this.dataService.setCurrentUser({
      userId: tokenInfo.jti,
      email: tokenInfo.email,
      role: tokenInfo.user_role,
      tagName: tokenInfo.unique_name,
    });
  }

  private setExpirationCounter(token: string) {
    const expiration = <number>JSON.parse(atob(token.split('.')[1])).exp * 1000; //expiration in milliseconds
    if (expiration < Date.now()) {
      this.logout();
    } else {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = timer(new Date(expiration))
        .pipe(tap(() => console.log('TOKEN EXPIRED!!')))
        .subscribe(() => this.logout());
    }
  }
}
