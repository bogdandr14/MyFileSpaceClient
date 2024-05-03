import { UserService } from './../../../user/user.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectoryModel } from '../../models/directory.model';
import { MenuController, ModalController } from '@ionic/angular';
import { ObjectEditComponent } from '../object-edit/object-edit.component';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';

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
  
  get accessibilityColor(){
    return this.uiHelperService.accessibilityColor(this.directory.accessLevel);
  }

  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    private modalCtrl: ModalController,
    private uiHelperService: UiHelperService,
    public fileSystemHelper: FileSystemHelperService
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
}
