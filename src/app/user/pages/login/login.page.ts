import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, first } from 'rxjs';
import { LoginModel } from '../../../core/models/auth/login.model';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  public loginModel = new LoginModel();
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onLogin(): void {
    this.authService.login(this.loginModel).pipe(first()).subscribe(
      (data) => this.alertService.showSuccess('_message._success.login'),
      (error) => this.alertService.showError(error)
    );
  }

  public onNavigateToRegister(): void {
    this.router.navigate(['user', 'register']);
  }
}
