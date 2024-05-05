import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { CurrentUserModel } from 'src/app/user/models/current-user.model';
import { UserDetailsModel } from 'src/app/user/models/user-details.model';
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
  private readonly sharedDirectory = {
    id: Guid.createEmpty(),
    name: '$SHARED_ROOT',
    accessLevel: 1,
  } as DirectoryDetailsModel;
  
  private accessedDirectories: DirectoryDetailsModel[] = [];
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
        this.createSharedDirectory(user);
      });
  }

  createSharedDirectory(user: CurrentUserModel) {
    this.sharedDirectory.childDirectories = user.allowedDirectories
      .filter(
        (x) => !user.allowedDirectories.some((y) => y.id == x.parentDirectoryId)
      )
      .map((d) => {
        d.parentDirectoryId = Guid.createEmpty();
        return d;
      });
    this.sharedDirectory.files = user.allowedFiles
      .filter(
        (x) => !user.allowedDirectories.some((y) => y.id == x.directoryId)
      )
      .map((f) => {
        f.directoryId = Guid.createEmpty();
        return f;
      });
    this.currentDirectoryDetails = this.sharedDirectory;
    this.accessedDirectories.push(this.currentDirectoryDetails);
  }

  loadSharedDirectory() {
    this.currentDirectoryDetails = this.sharedDirectory;
  }

  loadDirectory(directoryId: Guid) {
    const accessedDirectory = this.accessedDirectories.find(
      (x) => x.id == directoryId
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
