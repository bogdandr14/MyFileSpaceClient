import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileModel } from '../../models/file.model';
import { MenuController } from '@ionic/angular';
import { UserService } from '../../../user/user.service';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { FileService } from '../../services/file.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class FileItemComponent {
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
