import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs';
import { ChangePasswordModel } from 'src/app/core/models/auth/change-password.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public isInvalid = false;
  public resetPassword: ChangePasswordModel;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        take(1),
        map((queryParam) => queryParam['key'])
      )
      .subscribe((key) => this.handleKey(key));
  }

  handleKey(key: string) {
    if (key) {
      this.resetPassword = new ChangePasswordModel();
      this.resetPassword.isReset = true;
      this.resetPassword.currentPassword = key;
    } else {
      this.isInvalid = true;
      setTimeout(() => {
        this.router.navigate(['user', 'login']);
      }, 5000);
    }
  }

  confirmResetPassword() {
    this.authService.changePassword(this.resetPassword).subscribe(() => {
      this.alertService.showSuccess('_message._success.resetPassword');
      this.router.navigate(['user', 'login']);
    });
  }
}
