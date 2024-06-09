import { DataService } from '../../../core/services/data.service';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChangePasswordModel } from '../../../core/models/auth/change-password.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent  {
  public changePassword = new ChangePasswordModel();
  constructor(
    public modalCtrl: ModalController,
    private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService
  ) {}

  async confirmChangePassword() {
    this.changePassword.email = '';
    this.authService.changePassword(this.changePassword).subscribe(() => {
      this.alertService.showSuccess('_message._success.changePassword');
      this.dismiss();
    });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
