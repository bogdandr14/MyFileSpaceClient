import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { DirectoryModel } from '../../models/directory.model';
import { FileDetailsModel } from '../../models/file-details.model';
import { FileModel } from '../../models/file.model';
import { DirectoryService } from '../../services/directory.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-list-explorer',
  templateUrl: './list-explorer.component.html',
  styleUrls: ['./list-explorer.component.scss'],
})
export class ListExplorerComponent implements AfterViewInit {
  @Input() allFiles: FileModel[];
  @Input() allDirectories: DirectoryModel[];
  @Output() directoryChange = new EventEmitter();

  private searchText: string;

  public isFileDetails = false;
  public showDirectories = false;
  public detailsMenuObject:
    | FileDetailsModel
    | DirectoryDetailsModel
    | FileModel
    | DirectoryModel;

  public fixedCardHeight: number;

  public filteredFiles: FileModel[] = [];
  public filteredDirectories: DirectoryModel[] = [];

  constructor(
    private menuCtrl: MenuController,
    private fileService: FileService,
    private directoryService: DirectoryService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calculateFixedCardHeight();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateFixedCardHeight();
      this.filteredFiles = this.allFiles;
      this.filteredDirectories = this.allDirectories;
    }, 200);
  }

  calculateFixedCardHeight() {
    // Get the height of the fixed card
    const fixedCardElement = document.getElementById('fixed-search-card');
    if (fixedCardElement) {
      this.fixedCardHeight = fixedCardElement.offsetHeight + 10;
    }
  }

  filterItems($event) {
    this.searchText = $event.detail.value;
    this.filteredFiles = this.allFiles.filter((f) =>
      f.name.includes(this.searchText)
    );
    this.filteredDirectories = this.allDirectories.filter((d) =>
      d.name.includes(this.searchText)
    );
  }

  openDirectoryDetailsMenu(directoryId: Guid) {
    this.isFileDetails = false;
    if (this.allDirectories[0].isDeleted) {
      this.fillDetailsAndOpenMenu(
        this.allDirectories.find((x) => x.id === directoryId)
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
    if (this.allDirectories[0].isDeleted) {
      this.fillDetailsAndOpenMenu(this.allFiles.find((x) => x.id === fileId));
    } else {
      this.fileService
        .getFileInfo(fileId)
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
    this.menuCtrl.open('details-menu');
  }
}
