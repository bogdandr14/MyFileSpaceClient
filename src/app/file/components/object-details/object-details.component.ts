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

@Component({
  selector: 'app-object-details',
  templateUrl: './object-details.component.html',
  styleUrls: ['./object-details.component.scss'],
})
export class ObjectDetailsComponent {
  @Input() objectDetails: any;
  @Input() isFile: boolean = false;
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
    private translateService: TranslateService
  ) {}

  get timeOffset(): string {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const offsetHours = Math.abs(offsetInMinutes) / 60;
    const offsetSign = offsetInMinutes >= 0 ? '-' : '+';
    const offsetFormatted = `UTC${offsetSign}${offsetHours * 2}`;
    return offsetFormatted;
  }

  async confirmDeleteAccessKey() {
    await this.alertService.presentAlert(
      this.translateService.instant('_delete.accessKey'),
      this.translateService.instant('_delete.accessKeyMessage', {
        name: this.objectDetails.name
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
