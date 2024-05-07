import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { MenuController } from '@ionic/angular';
import { FileDetailsModel } from '../../models/file-details.model';
import { Guid } from 'guid-typescript';
import { DirectoryService } from '../../services/directory.service';
import { FileService } from '../../services/file.service';
import { take } from 'rxjs/operators';
import { DirectoryModel } from '../../models/directory.model';
import { FileModel } from '../../models/file.model';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {
  @Input() directoryDetails: DirectoryDetailsModel;
  @Input() directorySizes: any[];
  @Input() accessKey: string;
  @Input() isFilePseudoDirectory: boolean;
  @Output() directoryChange = new EventEmitter();

  public externalSize: number;
  public isFileDetails = false;
  public detailsMenuObject:
    | FileDetailsModel
    | DirectoryDetailsModel
    | FileModel
    | DirectoryModel;
  constructor(
    private menuCtrl: MenuController,
    private fileService: FileService,
    private directoryService: DirectoryService
  ) {}
  ngOnInit() {
    if (this.isFilePseudoDirectory) {
      this.isFileDetails = true;
      this.detailsMenuObject = this.directoryDetails.files[0];
      this.menuCtrl.open('details-menu');
    }
  }
  openCurrentDirectoryDetailsMenu() {
    this.isFileDetails = false;
    this.fillDetailsAndOpenMenu(this.directoryDetails);
  }

  openDirectoryDetailsMenu(directoryId: Guid) {
    this.isFileDetails = false;
    if (this.directoryDetails.isDeleted) {
      this.fillDetailsAndOpenMenu(
        this.directoryDetails.childDirectories.find((x) => x.id === directoryId)
      );
    } else {
      this.directoryService
        .getDirectoryInfo(directoryId)
        .pipe(take(1))
        .subscribe((directoryDetails) =>
          this.fillDetailsAndOpenMenu(directoryDetails)
        );
    }
  }

  openFileDetailsMenu(fileId: Guid) {
    this.isFileDetails = true;
    if (this.directoryDetails.isDeleted) {
      this.fillDetailsAndOpenMenu(
        this.directoryDetails.files.find((x) => x.id === fileId)
      );
    } else {
      this.fileService
        .getFileInfo(fileId, this.accessKey)
        .pipe(take(1))
        .subscribe((fileDetails) => this.fillDetailsAndOpenMenu(fileDetails));
    }
  }

  private fillDetailsAndOpenMenu(
    object:
      | FileModel
      | FileDetailsModel
      | DirectoryModel
      | DirectoryDetailsModel
  ) {
    this.detailsMenuObject = object;
    if (this.directorySizes) {
      const computedSize = this.directorySizes.find(
        (ds) => ds.id === object.id
      );
      if (computedSize) {
        this.externalSize = computedSize.size;
      }
    }
    this.menuCtrl.open('details-menu');
  }
}
