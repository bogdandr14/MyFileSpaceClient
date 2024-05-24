import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ClipboardService } from 'ngx-clipboard';
import { switchMap, iif, take, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { CurrentUserModel } from '../../models/current-user.model';
import { UserDetailsModel } from '../../models/user-details.model';
import { UserService } from '../../user.service';
import { ManagementService } from 'src/app/management/management.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private readonly bytesInGB = 1073741824;
  public maxStorage = 4294967296; //4GB
  public userInfo: CurrentUserModel | UserDetailsModel;

  get isAdmin() {
    if ((this.userInfo as CurrentUserModel) !== undefined) {
      return (this.userInfo as CurrentUserModel).roleType === 2;
    }
    return false;
  }
  get isCurrentUser() {
    return this.userService.isCurrentUser(this.userInfo?.userId);
  }

  get email() {
    if ((this.userInfo as CurrentUserModel) !== undefined) {
      return (this.userInfo as CurrentUserModel).email;
    }
    return null;
  }

  get lastPasswordChange() {
    if ((this.userInfo as CurrentUserModel) !== undefined) {
      const datetime = (this.userInfo as CurrentUserModel).lastPasswordChange;
      if (datetime.toString() !== '0001-01-01T00:00:00') {
        return datetime;
      }
    }
    return null;
  }

  get totalSize() {
    return this.userInfo.files.reduce((acc, obj) => acc + obj.sizeInBytes, 0);
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private clipboardService: ClipboardService,
    private alertService: AlertService,
    public localeService: LocaleService,
    public managementService: ManagementService,
    public uiHelper: UiHelperService
  ) {}

  private initialLoadObservable(internalRefresh: boolean) {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return iif<UserDetailsModel, CurrentUserModel>(
          () => !!params.get('id'),
          this.userService.getUser(
            this.getGuid(params.get('id')),
            internalRefresh
          ),
          this.userService.getPersonalInfo(internalRefresh)
        );
      }),
      tap((res) => (this.userInfo = res)),
      take(1)
    );
  }

  ngOnInit() {
    this.managementService
      .getAllowedStorage()
      .pipe(take(1))
      .subscribe((storage) => (this.maxStorage = storage.size * 1073741824));
    this.initialLoadObservable(false).subscribe();
  }

  handleRefresh(event) {
    this.initialLoadObservable(true).subscribe(() => {
      event.target.complete();
    });
  }

  isDirectoryEmpty(directoryId: Guid) {
    return !(
      this.userInfo.directories.some(
        (d) => d.parentDirectoryId === directoryId
      ) || this.userInfo.files.some((f) => f.directoryId === directoryId)
    );
  }

  copyTagNameToClipboard(tagName: string) {
    this.clipboardService.copy(tagName);
    this.alertService.showInfo('_message._information.tagNameCopied');
  }

  getGuid(id) {
    return id ? Guid.parse(id) : Guid.createEmpty();
  }
}
