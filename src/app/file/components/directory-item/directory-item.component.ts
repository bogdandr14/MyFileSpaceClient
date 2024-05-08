import { UserService } from './../../../user/user.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectoryModel } from '../../models/directory.model';
import { MenuController } from '@ionic/angular';
import { FileSystemHelperService } from '../../services/file-system-helper.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.scss'],
})
export class DirectoryItemComponent {
  @Input() directory: DirectoryModel;
  @Output() directoryChange = new EventEmitter();
  @Output() showDetails = new EventEmitter();

  get isOwner() {
    return this.userService.isCurrentUser(this.directory.ownerId);
  }
  
  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    public uiHelper: UiHelperService,
    public fileSystemHelper: FileSystemHelperService
  ) {}

  openDetailsMenu() {
    this.menuCtrl.open('details-menu');
  }
}
