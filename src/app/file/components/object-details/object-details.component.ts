import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { Component, Input, OnInit } from '@angular/core';
import { FileDetailsModel } from '../../models/file-details.model';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { UserService } from 'src/app/user/user.service';
import { DatePipe } from '@angular/common';
import { LocaleService } from 'src/app/core/services/locale.service';
import { AccessObjectModel } from 'src/app/core/models/access-object.model';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { AccessService } from '../../services/access.service';
import { take } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { AlertService } from 'src/app/core/services/alert.service';
import { AccessKeyModel } from '../../models/access-key.model';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from '../../services/file.service';
import { DirectoryService } from '../../services/directory.service';
import { DataService } from 'src/app/core/services/data.service';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { ObjectChangeModel } from 'src/app/core/models/object-change.model';

@Component({
  selector: 'app-object-details',
  templateUrl: './object-details.component.html',
  styleUrls: ['./object-details.component.scss'],
})
export class ObjectDetailsComponent {
  @Input() objectDetails: any;
  @Input() isFile: boolean = false;
  @Input() externalSize: number;

  public static readonly accessibilityData = [
    { icon: 'lock-closed', color: 'tertiary', level: 'private' },
    { icon: 'link', color: 'secondary', level: 'restricted' },
    { icon: 'accessibility', color: 'success', level: 'public' },
  ];

  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];

  get accessObject() {
    if (this.isFile) {
      return new AccessObjectModel(ObjectType.File, this.objectDetails.id);
    }
    return new AccessObjectModel(ObjectType.Directory, this.objectDetails.id);
  }

  get size() {
    let size = this.objectDetails.sizeInBytes;
    if (this.objectDetails.isDeleted && !this.isFile) {
      size = this.externalSize;
      if (!size) {
        size = 0;
      }
    }
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${ObjectDetailsComponent.sizes[i]}`;
  }
  get accessibilityColor() {
    return ObjectDetailsComponent.accessibilityData[
      this.objectDetails.accessLevel - 1
    ].color;
  }
  get accessibilityIcon() {
    return ObjectDetailsComponent.accessibilityData[
      this.objectDetails.accessLevel - 1
    ].icon;
  }
  get accessibilityName() {
    return ObjectDetailsComponent.accessibilityData[
      this.objectDetails.accessLevel - 1
    ].level;
  }
  get icon() {
    if (this.objectDetails instanceof DirectoryDetailsModel) {
      return 'folder';
    }
    if (
      this.objectDetails.contentType.includes('octet-stream') ||
      this.objectDetails.contentType.includes('compressed')
    ) {
      return 'file-tray-full';
    }
    if (this.objectDetails.contentType.includes('image')) {
      return 'image';
    }
    if (this.objectDetails.contentType.includes('video')) {
      return 'film';
    }
    if (this.objectDetails.contentType.includes('text')) {
      return 'document-text';
    }
    return 'document';
  }
  get isOwner() {
    return this.userService.isCurrentUser(this.objectDetails.ownerId);
  }
  constructor(
    private userService: UserService,
    public localeService: LocaleService,
    private accessService: AccessService,
    private clipboardService: ClipboardService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private fileService: FileService,
    private directoryService:DirectoryService,
    private dataService: DataService
  ) {}

  get timeOffset(): string {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const offsetHours = Math.abs(offsetInMinutes) / 60;
    const offsetSign = offsetInMinutes >= 0 ? '-' : '+';
    const offsetFormatted = `UTC${offsetSign}${offsetHours * 2}`;
    return offsetFormatted;
  }

  restore() {
    if(this.isFile){
      this.restoreFile();
    }else{
      this.restoreDirectory();
    }
  }

  restoreFile() {
    this.fileService
      .restoreFile(this.objectDetails.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Restore, this.objectDetails)
        );
        this.alertService.showInfo('_message._information.fileRestored');
      });
  }

  restoreDirectory() {
    this.directoryService
      .restoreDirectory(this.objectDetails.id)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(
            ObjectType.Directory,
            ActionType.Restore,
            this.objectDetails
          )
        );
        this.alertService.showInfo('_message._information.directoryRestored');
      });
  }

  confirmPermanentDelete() {
    if(this.isFile){
      this.confirmPermanentDeleteFile();
    }else{
      this.confirmPermanentDeleteDirectory();
    }
  }

  async confirmPermanentDeleteFile() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.file'),
      this.translateService.instant('_delete.filePermanentMessage', {
        fileName: this.objectDetails.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      this.deleteFilePermanent
    );
  }

  async deleteFilePermanent() {
    this.fileService
      .deleteFile(this.objectDetails.id, true)
      .pipe(take(1))
      .subscribe((file) => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, ActionType.Delete, this.objectDetails)
        );
        this.alertService.showInfo('_message._information.filePermanentDeleted');
      });
  }

  async confirmPermanentDeleteDirectory() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.directory'),
      this.translateService.instant('_delete.directoryPermanentMessage', {
        folderName: this.objectDetails.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      this.deleteDirectoryPermanent
    );
  }

  async deleteDirectoryPermanent() {
    this.directoryService
      .deleteDirectory(this.objectDetails.id, true)
      .pipe(take(1))
      .subscribe(() => {
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(
            ObjectType.Directory,
            ActionType.Delete,
            this.objectDetails
          )
        );
        this.alertService.showInfo(
          '_message._information.directoryPermanentDeleted'
        );
      });
  }

  async confirmDeleteAccessKey() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.accessKey'),
      this.translateService.instant('_delete.accessKeyMessage', {
        name: this.objectDetails.name,
      }),
      this.translateService.instant('_common.cancel'),
      this.translateService.instant('_common.confirm'),
      this,
      () => this.deleteAccessKey
    );
  }

  deleteAccessKey() {
    this.accessService
      .deleteAccessKey(this.accessObject)
      .pipe(take(1))
      .subscribe(() => {
        this.objectDetails.accessKey = null;
        this.alertService.showInfo('_message._information.accessKeyDeleted');
      });
  }
  copyOwner() {
    console.log(this.objectDetails.ownerId);
  }

  copyTagNameToClipboard(tagName: string) {
    this.clipboardService.copy(tagName);
    this.alertService.showInfo('_message._information.tagNameCopied');
  }

  copyAccessLinkToClipboard() {
    this.clipboardService.copy(this.objectDetails.accessKey.key);
    this.alertService.showInfo('_message._information.accessKeyCopied');
  }

  reloadUserAccess() {
    this.accessService
      .getUserAccess(this.accessObject)
      .pipe(take(1))
      .subscribe((allowedUsers) => {
        this.objectDetails.allowedUsers = allowedUsers.map(
          (item) => item.tagName
        );
      });
  }

  setAccessKey($event: AccessKeyModel) {
    this.objectDetails.accessKey = $event;
  }
}
