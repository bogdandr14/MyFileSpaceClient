import { DataService } from './../../../core/services/data.service';
import { UserService } from './../../../user/user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryModel } from '../../models/directory.model';
import { MenuController, ModalController } from '@ionic/angular';
import { DirectoryService } from '../../services/directory.service';
import { take } from 'rxjs';
import { ActionType } from '../../../core/models/action-type.enum';
import { ObjectChangeModel } from '../../../core/models/object-change.model';
import { ObjectType } from '../../../core/models/object-type.enum';
import { AlertService } from '../../../core/services/alert.service';
import { ObjectEditComponent } from '../object-edit/object-edit.component';
import { ObjectMoveModel } from '../../../core/models/object-move.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.scss'],
})
export class DirectoryItemComponent {
  @Input() directory: DirectoryModel;
  @Output() directoryChange = new EventEmitter();
  @Output() showDetails = new EventEmitter();

  get isOwner() {
    return this.userService.isCurrentUser(this.directory.ownerId);
  }

  constructor(
    private menuCtrl: MenuController,
    private directoryService: DirectoryService,
    private userService: UserService,
    private dataService: DataService,
    private alertService: AlertService,
    private modalCtrl: ModalController,
    private translateService: TranslateService
  ) {}

  openDetailsMenu() {
    this.menuCtrl.open('details-menu');
  }

  async openDirectoryEdit() {
    const directoryEditModal = await this.modalCtrl.create({
      component: ObjectEditComponent,
      componentProps: {
        isUpdate: true,
        toUpdate: this.directory,
      },
    });
    directoryEditModal.present();
  }

  public addDirectoryCut() {
    this.dataService.triggerObjectCut(
      new ObjectMoveModel(ObjectType.Directory, this.directory)
    );
  }

  async confirmDeleteDirectory() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.directory'),
      this.translateService.instant('_delete.directoryMessage', {
        folderName: this.directory.name
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      () => this.deleteDirectory
    );
  }

  deleteDirectory() {
    this.directoryService
      .deleteDirectory(this.directory.id)
      .pipe(take(1))
      .subscribe((directory) => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(
            ObjectType.Directory,
            ActionType.Delete,
            this.directory
          )
        );
        this.alertService.showInfo('_message._information.directoryDeleted');
      });
  }
}
