import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileModel } from '../../models/file.model';
import { MenuController, ModalController } from '@ionic/angular';
import { UserService } from '../../../user/user.service';
import { ObjectEditComponent } from '../object-edit/object-edit.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class FileItemComponent {
  @Input() file: FileModel;
  @Output() showDetails = new EventEmitter();

  get size() {
    return this.uiHelperService.computeSize(this.file.sizeInBytes);
  }
  get fileIcon() {
    return this.uiHelperService.objectIcon(this.file);
  }

  get isOwner() {
    return this.userService.isCurrentUser(this.file.ownerId);
  }

  get accessibilityColor() {
    return this.uiHelperService.accessibilityColor(this.file.accessLevel);
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

  async openFileEdit() {
    const directoryEditModal = await this.modalCtrl.create({
      component: ObjectEditComponent,
      componentProps: {
        isUpdate: true,
        toUpdate: this.file,
        isFile: true,
      },
    });
    directoryEditModal.present();
  }

  async openFileUpload() {
    const fileUploadModal = await this.modalCtrl.create({
      component: FileUploadComponent,
      componentProps: {
        isUpdate: true,
        fileId: this.file.id,
      },
    });
    fileUploadModal.present();
  }

  // getFileNameFromResponse(response: HttpResponse<Blob>): string | null {
  //   const contentDispositionHeader = response.headers.get(
  //     'content-disposition'
  //   );
  //   if (contentDispositionHeader) {
  //     const matches = contentDispositionHeader.match(
  //       /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  //     );
  //     if (matches && matches.length > 1) {
  //       const filename = matches[1].replace(/['"]/g, '');
  //       return decodeURIComponent(filename);
  //     }
  //   }
  //   return null;
  // }
}
