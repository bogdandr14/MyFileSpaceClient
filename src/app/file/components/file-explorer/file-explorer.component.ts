import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { MenuController } from '@ionic/angular';
import { FileDetailsModel } from '../../models/file-details.model';
import { Guid } from 'guid-typescript';
import { DirectoryService } from '../../services/directory.service';
import { FileService } from '../../services/file.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent {
  @Input() directoryDetails: DirectoryDetailsModel;
  @Output() directoryChange = new EventEmitter();

  public isFileDetails = false;
  public detailsMenuObject: FileDetailsModel | DirectoryDetailsModel;
  constructor(
    private menuCtrl: MenuController,
    private fileService: FileService,
    private directoryService: DirectoryService
  ) {}

  openCurrentDirectoryDetailsMenu() {
    this.isFileDetails = false;
    this.detailsMenuObject = this.directoryDetails;
    this.menuCtrl.open('details-menu');
  }

  openDirectoryDetailsMenu(directoryId: Guid) {
    this.isFileDetails = false;
    this.directoryService
      .getDirectoryInfo(directoryId)
      .pipe(take(1))
      .subscribe((directoryDetails) => {
        this.detailsMenuObject = directoryDetails;
        this.menuCtrl.open('details-menu');
      });
  }

  openFileDetailsMenu(fileId: Guid) {
    this.isFileDetails = true;
    this.fileService
      .getFileInfo(fileId)
      .pipe(take(1))
      .subscribe((fileDetails) => {
        this.detailsMenuObject = fileDetails;
        this.menuCtrl.open('details-menu');
      });
  }
}
