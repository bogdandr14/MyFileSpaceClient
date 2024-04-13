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

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  private timerSubscription = new Subscription();
  private isLoggedIn = new BehaviorSubject<boolean>(null);
  public isLoggedIn$ = this.isLoggedIn.asObservable().pipe(filter((val) => val !== null));

  constructor(
    public override http: HttpClient,
    private router: Router,
    private dataService: DataService
  ) {
    super(http, 'api/auth');
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

  public login(userCredentials: LoginModel): Observable<string> {
    return super.add<string>(userCredentials, 'login').pipe(
      tap((token) => {
        this.dataService.setToken(token);
        this.setUserInfo(token);
        this.isLoggedIn.next(true);
        this.router.navigate(['genealogy', 'tree']);
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
      tagName: tokenInfo.unique_name
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
