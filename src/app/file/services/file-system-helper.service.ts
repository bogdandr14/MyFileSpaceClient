import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { switchMap, take } from 'rxjs';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { ObjectChangeModel } from 'src/app/core/models/object-change.model';
import { ObjectMoveModel } from 'src/app/core/models/object-move.model';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { AlertService } from 'src/app/core/services/alert.service';
import { DataService } from 'src/app/core/services/data.service';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { ObjectEditComponent } from '../components/object-edit/object-edit.component';
import { DirectoryDetailsModel } from '../models/directory-details.model';
import { DirectoryModel } from '../models/directory.model';
import { FileDetailsModel } from '../models/file-details.model';
import { FileModel } from '../models/file.model';
import { DirectoryService } from './directory.service';
import { FileService } from './file.service';
import { UserService } from 'src/app/user/user.service';

@Injectable({ providedIn: 'root' })
export class FileSystemHelperService {
  constructor(
    private alertService: AlertService,
    private translateService: TranslateService,
    private fileService: FileService,
    private directoryService: DirectoryService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  addFavorite(file: FileModel | FileDetailsModel) {
    this.fileService
      .addFavorite(file.id)
      .pipe(take(1))
      .subscribe(() => {
        file.watchingUsers.push(this.userService.getUserId());
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Edit, file)
        );
      });
  }

  removeFavorite(file: FileModel | FileDetailsModel) {
    this.fileService
      .removeFavorite(file.id)
      .pipe(take(1))
      .subscribe(() => {
        file.watchingUsers = file.watchingUsers.filter(
          (wu) => wu != this.userService.getUserId()
        );
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Edit, file)
        );
      });
  }

  async openDirectoryEdit(directory: DirectoryModel) {
    const directoryEditModal = await this.modalCtrl.create({
      component: ObjectEditComponent,
      componentProps: {
        isUpdate: true,
        toUpdate: directory,
      },
    });
    directoryEditModal.present();
  }

  public addDirectoryCut(directory: DirectoryModel | DirectoryDetailsModel) {
    this.dataService.triggerObjectCut(
      new ObjectMoveModel(ObjectType.Directory, directory)
    );
  }

  restoreDirectory(directory: DirectoryModel | DirectoryDetailsModel) {
    this.directoryService
      .restoreDirectory(directory.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(
            ObjectType.Directory,
            ActionType.Restore,
            directory
          )
        );
        this.alertService.showInfo('_message._information.directoryRestored');
      });
  }

  async confirmPermanentDeleteDirectory(directory) {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.directory'),
      this.translateService.instant('_delete.directoryPermanentMessage', {
        folderName: directory.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      () => this.deleteDirectoryPermanent(directory)
    );
  }

  async deleteDirectoryPermanent(directory) {
    this.directoryService
      .deleteDirectory(directory.id, true)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(
            ObjectType.Directory,
            ActionType.Delete,
            directory
          )
        );
        this.alertService.showInfo(
          '_message._information.directoryPermanentDeleted'
        );
      });
  }

  async confirmDeleteDirectory(directory) {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.directory'),
      this.translateService.instant('_delete.directoryMessage', {
        folderName: directory.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      () => this.deleteDirectory(directory)
    );
  }

  async deleteDirectory(directory) {
    this.directoryService
      .deleteDirectory(directory.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(
            ObjectType.Directory,
            ActionType.Delete,
            directory
          )
        );
        this.alertService.showInfo('_message._information.directoryDeleted');
      });
  }

  async openFileEdit(file: FileModel) {
    const fileEditModal = await this.modalCtrl.create({
      component: ObjectEditComponent,
      componentProps: {
        isUpdate: true,
        toUpdate: file,
        isFile: true,
      },
    });
    fileEditModal.present();
  }

  async openFileUpload(fileId: Guid) {
    const fileUploadModal = await this.modalCtrl.create({
      component: FileUploadComponent,
      componentProps: {
        isUpdate: true,
        fileId: fileId,
      },
    });
    fileUploadModal.present();
  }

  public addFileCut(file: FileModel | FileDetailsModel) {
    this.dataService.triggerObjectCut(
      new ObjectMoveModel(ObjectType.File, file)
    );
  }

  restoreFile(file: FileModel | FileDetailsModel) {
    this.fileService
      .restoreFile(file.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Restore, file)
        );
        this.alertService.showInfo('_message._information.fileRestored');
      });
  }

  async confirmPermanentDeleteFile(file: FileModel | FileDetailsModel) {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.file'),
      this.translateService.instant('_delete.filePermanentMessage', {
        fileName: file.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      () => this.deleteFilePermanent(file)
    );
  }

  async deleteFilePermanent(file: FileModel | FileDetailsModel) {
    this.fileService
      .deleteFile(file.id, true)
      .pipe(take(1))
      .subscribe((file) => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Delete, file)
        );
        this.alertService.showInfo(
          '_message._information.filePermanentDeleted'
        );
      });
  }

  async confirmDeleteFile(file: FileModel | FileDetailsModel) {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.file'),
      this.translateService.instant('_delete.fileMessage', {
        fileName: file.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      () => this.deleteFile(file)
    );
  }

  async deleteFile(file: FileModel | FileDetailsModel) {
    this.fileService
      .deleteFile(file.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Delete, file)
        );
        this.alertService.showInfo('_message._information.fileDeleted');
      });
  }

  public downloadFile(file: FileModel | FileDetailsModel) {
    this.route.queryParams
      .pipe(
        switchMap((queryParams) =>
          this.fileService.downloadFile(file.id, queryParams['accessKey'])
        ),
        take(1)
      )
      .subscribe((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }, 100);
      });
  }
}
