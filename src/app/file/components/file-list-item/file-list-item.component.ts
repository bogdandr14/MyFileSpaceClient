import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { UserService } from 'src/app/user/user.service';
import { FileModel } from '../../models/file.model';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-list-item',
  templateUrl: './file-list-item.component.html',
  styleUrls: ['./file-list-item.component.scss'],
})
export class FileListItemComponent {
  @Input() file: FileModel;
  @Output() showDetails = new EventEmitter();

  get isOwner() {
    return this.userService.isCurrentUser(this.file.ownerId);
  }
  get isFavorite() {
    return this.file.watchingUsers.some(
      (wu) => wu == this.userService.getUserId()
    );
  }

  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    public uiHelper: UiHelperService,
    public fileSystemHelper: FileSystemHelperService,
    public fileService: FileService,
    public authService: AuthService
  ) {}

  openDetailsMenu() {
    this.menuCtrl.open('details-menu');
  }
}
