import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  public isInvalid = false;
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
    if (!key) {
      this.isInvalid = true;
      setTimeout(() => {
        this.router.navigate(['user', 'login']);
      }, 5000);
    } else {
      this.authService
        .confirmEmail(key)
        .pipe(take(1))
        .subscribe(() => {
          this.alertService.showSuccess('_message._success.emailConfirmed');
          this.router.navigate(['user', 'login']);
        });
    }
  }
}
