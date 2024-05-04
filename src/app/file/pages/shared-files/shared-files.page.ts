import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { UserService } from 'src/app/user/user.service';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { DirectoryModel } from '../../models/directory.model';
import { FileModel } from '../../models/file.model';
import { DirectoryService } from '../../services/directory.service';

@Component({
  selector: 'app-shared-files',
  templateUrl: './shared-files.page.html',
  styleUrls: ['./shared-files.page.scss'],
})
export class SharedFilesPage implements OnInit {
  private accessedDirectories: DirectoryDetailsModel[] = [];
  private sharedFiles: FileModel[];
  private sharedDirectories: DirectoryModel[];
  public currentDirectoryDetails: DirectoryDetailsModel;

  constructor(
    private directoryService: DirectoryService,
    private userService: UserService,
    public uiHelper: UiHelperService
  ) {}

  ngOnInit() {
    this.userService
      .getPersonalInfo()
      .pipe(take(1))
      .subscribe((user) => {
        this.sharedFiles = user.allowedFiles;
        this.sharedDirectories = user.allowedDirectories;
        this.createSharedDirectory();
      });
  }

  createSharedDirectory() {
    this.currentDirectoryDetails = new DirectoryDetailsModel();
    this.currentDirectoryDetails.accessLevel = AccessLevel.Private;
    this.currentDirectoryDetails.name = '$SHARED_ROOT';
    this.currentDirectoryDetails.id = Guid.createEmpty();
    this.currentDirectoryDetails.childDirectories = this.sharedDirectories
      .filter(
        (x) => !this.sharedDirectories.some((y) => y.id == x.parentDirectoryId)
      )
      .map((d) => {
        d.parentDirectoryId = Guid.createEmpty();
        return d;
      });
    this.currentDirectoryDetails.files = this.sharedFiles
      .filter((x) => !this.sharedDirectories.some((y) => y.id == x.directoryId))
      .map((f) => {
        f.directoryId = Guid.createEmpty();
        return f;
      });
    this.accessedDirectories.push(this.currentDirectoryDetails);
  }

  loadDirectory(directoryId: Guid) {
    const accessedDirectory = this.accessedDirectories.find(
      (x) => x.id === directoryId
    );
    if (accessedDirectory) {
      this.currentDirectoryDetails = accessedDirectory;
      return;
    }
    this.directoryService
      .getDirectoryInfo(directoryId)
      .pipe(take(1))
      .subscribe((directory) => {
        this.currentDirectoryDetails = directory;
        this.accessedDirectories.push(directory);
      });
  }
}
