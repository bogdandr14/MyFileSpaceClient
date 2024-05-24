import { DataService } from './../../../core/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, first, take } from 'rxjs';
import { RegisterModel } from '../../../core/models/auth/register.model';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  public registerModel = new RegisterModel();
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService
      .getLanguage()
      .pipe(take(1))
      .subscribe((lang) => {
        this.registerModel.language = lang ?? 'en';
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onRegister(): void {
    if (!!this.registerModel.tagName) {
      this.registerModel.tagName = '';
    }
    this.authService
      .register(this.registerModel)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.showSuccess('_message._success.register');
          this.onNavigateToLogin();
        },
        (error) => this.alertService.showError(error)
      );
  }

  private onNavigateToLogin(): void {
    this.router.navigate(['user', 'login']);
  }
}
