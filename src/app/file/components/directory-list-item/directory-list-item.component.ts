import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { UserService } from 'src/app/user/user.service';
import { DirectoryModel } from '../../models/directory.model';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { LocaleService } from 'src/app/core/services/locale.service';

@Component({
  selector: 'app-directory-list-item',
  templateUrl: './directory-list-item.component.html',
  styleUrls: ['./directory-list-item.component.scss'],
})
export class DirectoryListItemComponent {
  @Input() directory: DirectoryModel;
  @Output() directoryChange = new EventEmitter();
  @Output() showDetails = new EventEmitter();
  @Input() path;

  get isOwner() {
    return this.userService.isCurrentUser(this.directory.ownerId);
  }

  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    public uiHelper: UiHelperService,
    public fileSystemHelper: FileSystemHelperService,
    public localeService: LocaleService
  ) {}

  openDetailsMenu() {
    this.menuCtrl.open('details-menu');
  }
}
