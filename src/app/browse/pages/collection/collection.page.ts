import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { combineLatest, iif, mergeMap, of, switchMap, take } from 'rxjs';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { DirectoryDetailsModel } from 'src/app/file/models/directory-details.model';
import { FileDetailsModel } from 'src/app/file/models/file-details.model';
import { DirectoryService } from 'src/app/file/services/directory.service';
import { FileService } from 'src/app/file/services/file.service';
import { UserDetailsModel } from 'src/app/user/models/user-details.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  private readonly collectionDirectory = {
    id: Guid.createEmpty(),
    name: '$COLLECTION_ROOT',
    accessLevel: 3,
    pathParentDirectories: [],
    allowedUsers: [],
  } as DirectoryDetailsModel;
  private accessedDirectories: DirectoryDetailsModel[];
  private objectType = ObjectType.Directory;
  public collectionOwner: UserDetailsModel;
  public currentDirectoryDetails: DirectoryDetailsModel;
  public accessKey: string;
  public viewHierarchy = true;

  public get isFile() {
    return this.objectType == ObjectType.File;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fileService: FileService,
    private directoryService: DirectoryService,
    public uiHelper: UiHelperService
  ) {}

  private initialLoadObservable(internalRefresh: boolean) {
    return combineLatest([this.route.queryParams, this.route.paramMap]).pipe(
      switchMap(([queryParams, paramMap]) => {
        return this.userService
          .getUser(paramMap.get('id'), internalRefresh)
          .pipe(
            mergeMap((user) => {
              const objectId = queryParams['id'];
              this.accessKey = queryParams['accessKey'];
              this.objectType = queryParams['type'];
              this.createCollectionDirectory(user);
              return iif<DirectoryDetailsModel, DirectoryDetailsModel>(
                () => !objectId || objectId == Guid.createEmpty(),
                of(this.collectionDirectory),
                iif<DirectoryDetailsModel, DirectoryDetailsModel>(
                  () => this.objectType == ObjectType.File,
                  this.fileService
                    .getFileInfo(objectId, this.accessKey, internalRefresh)
                    .pipe(
                      switchMap((file) =>
                        of(this.createFilePseudoDirectory(file))
                      )
                    ),
                  this.directoryService.getDirectoryInfo(
                    objectId,
                    this.accessKey,
                    internalRefresh
                  )
                )
              );
            })
          );
      }),
      take(1)
    );
  }

  private createCollectionDirectory(user: UserDetailsModel) {
    this.collectionOwner = user;
    this.collectionDirectory.ownerId = user.userId;
    this.collectionDirectory.ownerTagName = user.tagName;
    this.collectionDirectory.childDirectories = user.directories
      .filter((x) => !user.directories.some((y) => y.id == x.parentDirectoryId))
      .map((d) => {
        d.parentDirectoryId = Guid.createEmpty();
        return d;
      });
    this.collectionDirectory.files = user.files
      .filter((x) => !user.files.some((y) => y.id == x.directoryId))
      .map((f) => {
        f.directoryId = Guid.createEmpty();
        return f;
      });
    return this.collectionDirectory;
  }

  ngOnInit() {
    this.initialLoadObservable(false).subscribe((directory) => {
      this.currentDirectoryDetails = directory;
      this.accessedDirectories = [directory];
    });
  }

  handleRefresh(event) {
    this.initialLoadObservable(true).subscribe((directory) => {
      this.currentDirectoryDetails = directory;
      this.accessedDirectories = [directory];
      event.target.complete();
    });
  }

  createFilePseudoDirectory(file: FileDetailsModel) {
    const filePseudoDirectory = this.collectionDirectory;
    filePseudoDirectory.name = '-';
    filePseudoDirectory.files = [file];
    filePseudoDirectory.childDirectories = [];
    return filePseudoDirectory;
  }

  public loadCollectionDirectory() {
    this.currentDirectoryDetails = this.collectionDirectory;
  }

  public loadDirectory(directoryId: Guid) {
    const accessedDirectory = this.accessedDirectories.find(
      (x) => x.id == directoryId
    );
    this.viewHierarchy = true;
    if (accessedDirectory) {
      this.router.navigate(
        ['browse/collection/', this.collectionOwner.userId],
        {
          queryParams: { id: directoryId, type: null },
        }
      );
      this.currentDirectoryDetails = accessedDirectory;
      return;
    }
    this.directoryService
      .getDirectoryInfo(directoryId)
      .pipe(take(1))
      .subscribe((directory) => {
        this.router.navigate(
          ['browse/collection/', this.collectionOwner.userId],
          {
            queryParams: { id: directoryId, type: null },
          }
        );
        this.currentDirectoryDetails = directory;
        this.accessedDirectories.push(directory);
      });
  }

  public toggleViewType($event) {
    this.viewHierarchy = $event.detail.value == '1';
  }
}
