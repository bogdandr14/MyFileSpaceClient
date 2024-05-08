import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserEditModel } from '../../models/user-edit.model';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent {
  @Input() set tagName(tagName: string) {
    if (!this.userEdit) {
      this.userEdit = new UserEditModel(tagName);
    }
  }
  @Output() saveConfirmed = new EventEmitter<boolean>();

  public userEdit: UserEditModel;
  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {}

  submitInfo() {
    this.userService.updateUser(this.userEdit).subscribe(() => {
      this.saveConfirmed.emit(true);
      this.dismiss();
    });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
