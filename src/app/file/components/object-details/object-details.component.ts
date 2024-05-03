import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { AccessObjectModel } from 'src/app/core/models/access-object.model';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { AccessService } from '../../services/access.service';
import { take } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { AlertService } from 'src/app/core/services/alert.service';
import { AccessKeyModel } from '../../models/access-key.model';
import { TranslateService } from '@ngx-translate/core';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';

@Component({
  selector: 'app-object-details',
  templateUrl: './object-details.component.html',
  styleUrls: ['./object-details.component.scss'],
})
export class ObjectDetailsComponent {
  @Input() objectDetails: any;
  @Input() isFile: boolean = false;
  @Input() externalSize: number;

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
    }
    return this.uiHelperService.computeSize(size);
  }

  get accessibilityColor() {
    return this.uiHelperService.accessibilityColor(
      this.objectDetails.accessLevel
    );
  }
  get accessibilityIcon() {
    return this.uiHelperService.accessibilityIcon(
      this.objectDetails.accessLevel
    );
  }
  get accessibilityName() {
    return this.uiHelperService.accessibilityName(
      this.objectDetails.accessLevel
    );
  }
  get icon() {
    return this.uiHelperService.objectIcon(this.objectDetails);
  }

  get isOwner() {
    return this.userService.isCurrentUser(this.objectDetails.ownerId);
  }

  get timeOffset(): string {
    return this.uiHelperService.timeOffset();
  }

  constructor(
    private userService: UserService,
    private accessService: AccessService,
    private clipboardService: ClipboardService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private fileSystemHelper: FileSystemHelperService,
    private uiHelperService: UiHelperService,
    public localeService: LocaleService
  ) {}

  copyTagNameToClipboard(tagName: string) {
    this.clipboardService.copy(tagName);
    this.alertService.showInfo('_message._information.tagNameCopied');
  }

  copyAccessLinkToClipboard() {
    this.clipboardService.copy(this.objectDetails.accessKey.key);
    this.alertService.showInfo('_message._information.accessKeyCopied');
  }

  restore() {
    if (this.isFile) {
      this.fileSystemHelper.restoreFile(this.objectDetails);
    } else {
      this.fileSystemHelper.restoreDirectory(this.objectDetails);
    }
  }

  confirmPermanentDelete() {
    if (this.isFile) {
      this.fileSystemHelper.confirmPermanentDeleteFile(this.objectDetails);
    } else {
      this.fileSystemHelper.confirmPermanentDeleteDirectory(this.objectDetails);
    }
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
      this.deleteAccessKey
    );
  }

  async deleteAccessKey() {
    this.accessService
      .deleteAccessKey(this.accessObject)
      .pipe(take(1))
      .subscribe(() => {
        this.objectDetails.accessKey = null;
        this.alertService.showInfo('_message._information.accessKeyDeleted');
      });
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
