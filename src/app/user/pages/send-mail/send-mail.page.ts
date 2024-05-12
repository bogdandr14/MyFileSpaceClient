import { DataService } from './../../../core/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, first, map, mergeMap, switchMap, take } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from '../../user.service';
import { MailRequestModel } from '../../models/mail-request.model';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.page.html',
  styleUrls: ['./send-mail.page.scss'],
})
export class SendMailPage implements OnDestroy, OnInit {
  private destroy$: Subject<boolean> = new Subject();
  public mailRequestModel = new MailRequestModel();
  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams
      .pipe(map((queryParams) => queryParams['type']))
      .subscribe((type) => {
        this.mailRequestModel.type = type == 'resetpassword' ? 2 : 1;
      });

    this.dataService.getLanguage().pipe(take(1)).subscribe((language) => {
      this.mailRequestModel.language = language ?? 'en';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onSend(): void {
    this.userService
      .sendMail(this.mailRequestModel)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.showSuccess('_message._information.mailSent');
          //this.router.navigate(['user', 'login']);
        },
        (error) => this.alertService.showError(error)
      );
  }
}
