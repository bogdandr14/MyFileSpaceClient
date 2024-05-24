import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { iif, of, switchMap, take, tap } from 'rxjs';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { CurrentUserModel } from 'src/app/user/models/current-user.model';
import { UserService } from 'src/app/user/user.service';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
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
    accessLevel: 2,
  } as DirectoryDetailsModel;

  private accessedDirectories: DirectoryDetailsModel[] = [];
  public currentUser: CurrentUserModel;
  public currentDirectoryDetails: DirectoryDetailsModel;
  public viewHierarchy = true;
  public isReloading = false;

  constructor(
    private directoryService: DirectoryService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public uiHelper: UiHelperService
  ) {}

  private initialLoadObservable(internalRefresh: boolean) {
    return this.route.queryParams
      .pipe(
        switchMap((params) =>
          iif<DirectoryDetailsModel, DirectoryDetailsModel>(
            () => !!params['id'],
            this.directoryService.getDirectoryInfo(
              this.getGuid(params['id']),
              null,
              internalRefresh
            ),
            this.userService
              .getPersonalInfo(internalRefresh)
              .pipe(
                switchMap((currentUser) =>
                  of(this.createSharedDirectory(currentUser))
                )
              )
          )
        )
      )
      .pipe(
        take(1),
        tap((directory) => {
          this.currentDirectoryDetails = directory;
          this.accessedDirectories = [this.currentDirectoryDetails];
        })
      );
  }

  private createSharedDirectory(user: CurrentUserModel): DirectoryDetailsModel {
    this.currentUser = user;
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

    return this.sharedDirectory;
  }

  ngOnInit() {
    this.initialLoadObservable(false).subscribe();
  }

  handleRefresh(event) {
    this.isReloading = true;
    this.initialLoadObservable(true).subscribe(() => {
      this.isReloading = false;
      event.target.complete();
    });
  }

  loadSharedDirectory() {
    const accessedSharedDirectory = this.accessedDirectories.find(
      (x) => x.id == this.sharedDirectory.id
    );
    if (accessedSharedDirectory) {
      this.currentDirectoryDetails = accessedSharedDirectory;
      this.router.navigate(['/file/shared']);
    } else {
      this.userService
        .getPersonalInfo()
        .pipe(take(1))
        .subscribe((user) => {
          this.createSharedDirectory(user);
          this.router.navigate(['/file/shared']);
          this.currentDirectoryDetails = this.sharedDirectory;
          this.accessedDirectories.push(this.sharedDirectory);
        });
    }
  }

  toggleViewType($event) {
    this.viewHierarchy = $event.detail.value == '1';
  }

  loadDirectory(directoryId: Guid) {
    const accessedDirectory = this.accessedDirectories.find(
      (x) => x.id == directoryId
    );

    this.viewHierarchy = true;

    if (accessedDirectory) {
      this.router.navigate(['/file/shared'], {
        queryParams: { id: directoryId },
      });
      this.currentDirectoryDetails = accessedDirectory;
      return;
    }
    this.directoryService
      .getDirectoryInfo(directoryId)
      .pipe(take(1))
      .subscribe((directory) => {
        this.router.navigate(['/file/shared'], {
          queryParams: { id: directoryId },
        });
        this.currentDirectoryDetails = directory;
        this.accessedDirectories.push(directory);
      });
  }

  getGuid(id) {
    return id ? Guid.parse(id) : Guid.createEmpty();
  }
}
