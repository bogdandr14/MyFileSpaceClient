import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs';
import { AccessObjectModel } from 'src/app/core/models/access-object.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserModel } from 'src/app/user/models/user.model';
import { UserAccessUpdateModel } from '../../models/user-access-update.model';
import { UserAccessModel } from '../../models/user-access.model';
import { AccessService } from '../../services/access.service';

@Component({
  selector: 'app-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss'],
})
export class EditAccessComponent implements OnInit {
  @Input() accessObject: AccessObjectModel;
  @Output() userAccessChange = new EventEmitter();

  public allowedUsers: UserAccessModel[];
  public modalHeight: string;
  public usersToAdd: UserModel[] = [];

  get updatedAllowedUsers() {
    return this.allowedUsers.filter((u) => !u.isRemoved);
  }
  get removedUsers() {
    return this.allowedUsers.filter((u) => u.isRemoved);
  }

  get modalContentMaxHeight() {
    const maxHeight = this.isMobile ? '100vh' : '100vh'; // Adjust the percentage as needed
    return maxHeight;
  }
  get modalCardMaxHeight() {
    return '40vh';
  }

  get isMobile() {
    return window.innerWidth < 768; // Adjust the breakpoint as needed
  }

  constructor(
    private modalCtrl: ModalController,
    private accessService: AccessService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.accessService
      .getUserAccess(this.accessObject)
      .pipe(take(1))
      .subscribe((allowedUsers) => {
        this.allowedUsers = allowedUsers.map(
          (item) => new UserAccessModel(item.userId, item.tagName)
        );
      });
  }

  toggleRemove(userId: Guid) {
    const userIndex = this.allowedUsers.findIndex((u) => u.userId === userId);
    if (userIndex !== -1) {
      this.allowedUsers[userIndex].isRemoved =
        !this.allowedUsers[userIndex].isRemoved;
    }
  }

  removeAddedUser(userId: Guid) {
    this.usersToAdd = this.usersToAdd.filter((x) => x.userId !== userId);
  }

  addUser($event) {
    if (!this.usersToAdd.some((u) => u.userId === $event.userId)) {
      const allowedUserIndex = this.allowedUsers.findIndex(
        (u) => u.userId === $event.userId
      );
      if (allowedUserIndex === -1) {
        this.usersToAdd.push($event);
      } else {
        this.allowedUsers[allowedUserIndex].isRemoved = false;
      }
    }
  }

  onSubmit() {
    const userAccessUpdate = new UserAccessUpdateModel();
    userAccessUpdate.objectId = this.accessObject.objectId;
    userAccessUpdate.objectType = this.accessObject.objectType;
    userAccessUpdate.addUserIds = this.usersToAdd.map((u) => u.userId);
    userAccessUpdate.removeUserIds = this.removedUsers.map((u) => u.userId);
    this.accessService
      .updateUserAccess(userAccessUpdate)
      .pipe(take(1))
      .subscribe(() => {
        this.userAccessChange.emit();
        this.alertService.showSuccess('_message._success.userAccessEdit');
        this.dismiss();
      });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
