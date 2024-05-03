import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileModel } from '../../models/file.model';
import { MenuController, ModalController } from '@ionic/angular';
import { FileService } from '../../services/file.service';
import { take } from 'rxjs/operators';
import { ActionType } from '../../../core/models/action-type.enum';
import { ObjectChangeModel } from '../../../core/models/object-change.model';
import { ObjectType } from '../../../core/models/object-type.enum';
import { AlertService } from '../../../core/services/alert.service';
import { DataService } from '../../../core/services/data.service';
import { UserService } from '../../../user/user.service';
import { ObjectEditComponent } from '../object-edit/object-edit.component';
import { ObjectMoveModel } from '../../../core/models/object-move.model';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class FileItemComponent {
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];
  @Input() file: FileModel;
  @Output() showDetails = new EventEmitter();

  get size() {
    let size = this.file.sizeInBytes;
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${FileItemComponent.sizes[i]}`;
  }
  get fileIcon() {
    if (
      this.file.contentType.includes('octet-stream') ||
      this.file.contentType.includes('compressed')
    ) {
      return 'file-tray-full';
    }
    if (this.file.contentType.includes('image')) {
      return 'image';
    }
    if (this.file.contentType.includes('video')) {
      return 'film';
    }
    if (this.file.contentType.includes('text')) {
      return 'document-text';
    }
    return 'document';
  }

  get isOwner() {
    return this.userService.isCurrentUser(this.file.ownerId);
  }

  constructor(
    private menuCtrl: MenuController,
    private fileService: FileService,
    private dataService: DataService,
    private alertService: AlertService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private translateService: TranslateService
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

  restoreFile() {
    this.fileService
      .restoreFile(this.file.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Restore, this.file)
        );
        this.alertService.showInfo('_message._information.fileRestored');
      });
  }

  async confirmPermanentDeleteFile() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.file'),
      this.translateService.instant('_delete.filePermanentMessage', {
        fileName: this.file.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      this.deleteFilePermanent
    );
  }

  async deleteFilePermanent() {
    this.fileService
      .deleteFile(this.file.id, true)
      .pipe(take(1))
      .subscribe((file) => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Delete, this.file)
        );
        this.alertService.showInfo('_message._information.filePermanentDeleted');
      });
  }

  async confirmDeleteFile() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.file'),
      this.translateService.instant('_delete.fileMessage', {
        fileName: this.file.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      this.deleteFile
    );
  }

  async deleteFile() {
    this.fileService
      .deleteFile(this.file.id)
      .pipe(take(1))
      .subscribe((file) => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Delete, this.file)
        );
        this.alertService.showInfo('_message._information.fileDeleted');
      });
  }

  public addFileCut() {
    this.dataService.triggerObjectCut(
      new ObjectMoveModel(ObjectType.File, this.file)
    );
  }

  public downloadFile() {
    this.fileService
      .downloadFile(this.file.id)
      .pipe(take(1))
      .subscribe((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = this.file.name;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }, 100);
      });
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
