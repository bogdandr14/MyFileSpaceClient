import { ObjectChangeModel } from './../../../core/models/object-change.model';
import { DataService } from './../../../core/services/data.service';
import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../../services/directory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, iif, take, tap, of, forkJoin } from 'rxjs';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { Guid } from 'guid-typescript';
import { ObjectType } from '../../../core/models/object-type.enum';
import { ActionType } from '../../../core/models/action-type.enum';
import { FileModel } from '../../models/file.model';
import { DirectoryModel } from '../../models/directory.model';
import { ObjectMoveModel } from '../../../core/models/object-move.model';
import { FileService } from '../../services/file.service';
import { AlertService } from '../../../core/services/alert.service';
import { ClipboardService } from 'ngx-clipboard';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.page.html',
  styleUrls: ['./my-files.page.scss'],
})
export class MyFilesPage implements OnInit {
  public directoryDetails: DirectoryDetailsModel;
  public isReloading = false;
  private accessedDirectories: DirectoryDetailsModel[] = [];
  private objectCut: ObjectMoveModel;
  private countRefresh: number = 0;
  public allFiles: FileModel[];
  public allDirectories: DirectoryModel[];
  public viewHierarchy = true;

  get isObjectCut() {
    return !!this.objectCut;
  }

  get objectCutType() {
    return this.objectCut.type;
  }

  get canPasteHere() {
    if (this.objectCut.type == ObjectType.File) {
      return !this.directoryDetails.files.some(
        (f) => f.id === this.objectCut.cutObject.id
      );
    } else {
      return (
        this.directoryDetails.id !== this.objectCut.cutObject.id &&
        !this.directoryDetails.pathParentDirectories.some(
          (pd) => pd.id === this.objectCut.cutObject.id
        )
      );
    }
  }

  constructor(
    private directoryService: DirectoryService,
    private fileService: FileService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private clipboardService: ClipboardService,
    private router: Router,
    public uiHelper: UiHelperService
  ) {}

  private initialLoadObservable(internalRefresh: boolean) {
    return this.route.queryParams
      .pipe(
        switchMap((params) =>
          iif<Guid, Guid>(
            () => !!params['id'],
            of(this.getGuid(params['id'])),
            this.directoryService
              .getAllDirectories(null, internalRefresh)
              .pipe(
                switchMap((directories) =>
                  of(
                    directories.find(
                      (directory) => directory.name == '$USER_ROOT'
                    ).id
                  )
                )
              )
          )
        ),
        switchMap((directoryGuid) =>
          this.directoryService.getDirectoryInfo(
            directoryGuid,
            null,
            internalRefresh
          )
        )
      )
      .pipe(
        take(1),
        tap((directory) => {
          this.directoryDetails = directory;
          this.accessedDirectories = [directory];
        })
      );
  }

  ngOnInit() {
    this.initialLoadObservable(false).subscribe();

    this.dataService.objectChange$.subscribe((objectChange) => {
      this.handleObjectChange(objectChange);
    });

    this.dataService.objectCut$.subscribe((objectCut) => {
      this.objectCut = objectCut;
    });
  }

  handleRefresh(event) {
    this.isReloading = true;
    this.initialLoadObservable(true).subscribe(() => {
      this.determineReloadStop(event);
    });

    forkJoin([
      this.fileService.getAllFiles(null, true),
      this.directoryService.getAllDirectories(null, true),
    ]).subscribe(([files, directories]) => {
      this.allFiles = files;
      this.allDirectories = directories.filter((x) => x.name !== '$USER_ROOT');
      this.determineReloadStop(event);
    });
  }

  private determineReloadStop(event) {
    if (this.countRefresh === 1) {
      this.isReloading = false;
      event.target.complete();
      this.countRefresh = 0;
    } else {
      this.countRefresh = 1;
    }
  }

  copyAccessLinkToClipboard() {
    this.clipboardService.copy(this.directoryDetails.accessKey.key);
    this.alertService.showInfo('_message._information.accessKeyCopied');
  }

  pasteHere() {
    iif(
      () => this.objectCut.type === ObjectType.File,
      this.fileService.moveFile(
        this.objectCut.cutObject.id,
        this.directoryDetails.id
      ),
      this.directoryService.moveDirectory(
        this.objectCut.cutObject.id,
        this.directoryDetails.id
      )
    )
      .pipe(take(1))
      .subscribe((x) => {
        this.alertService.showSuccess(
          '_message._success.' +
            (this.objectCut.type === ObjectType.File ? 'file' : 'directory') +
            'Move'
        );
        this.handleObjectChange(
          new ObjectChangeModel(
            this.objectCut.type,
            ActionType.Move,
            this.objectCut.cutObject
          )
        );
        this.dataService.triggerObjectCut(null);
      });
  }

  handleObjectChange(objectChange: ObjectChangeModel) {
    if (objectChange.type == ObjectType.Directory) {
      this.handleDirectoryChange(objectChange);
    }

    if (objectChange.type == ObjectType.File) {
      this.handleFileChange(objectChange);
    }
  }

  handleFileChange(fileChange: ObjectChangeModel) {
    const file = fileChange.changedObject as FileModel;
    if (fileChange.action == ActionType.Add) {
      if (this.allFiles) {
        this.allFiles.push(file);
      }
      this.directoryDetails.files.push(file);
    } else if (fileChange.action == ActionType.Edit) {
      const index = this.directoryDetails.files.findIndex(
        (obj) => obj.id === file.id
      );
      if (index !== -1) {
        this.directoryDetails.files[index] = file;
      } else {
        this.directoryDetails.files.push(file);
      }
    } else if (fileChange.action == ActionType.Delete) {
      if (this.allFiles) {
        this.allFiles = this.allFiles.filter((x) => x.id !== file.id);
      }
      const index = this.directoryDetails.files.findIndex(
        (obj) => obj.id === file.id
      );
      if (index !== -1) {
        this.directoryDetails.files.splice(index, 1);
      }
    } else if (fileChange.action == ActionType.Move) {
      for (const accessedDirectory of this.accessedDirectories) {
        const subObjectIndexToRemove = accessedDirectory.files.findIndex(
          (obj) => obj.id === file.id
        );
        if (subObjectIndexToRemove !== -1) {
          accessedDirectory.files.splice(subObjectIndexToRemove, 1);
          break; // Stop the loop after removing the sub-object
        }
      }
      this.directoryDetails.files.push(file);
    }
    this.updateAccessedDirectory();
  }

  handleDirectoryChange(directoryChange: ObjectChangeModel) {
    const directory = directoryChange.changedObject as DirectoryModel;
    if (directoryChange.action == ActionType.Add) {
      if (this.allDirectories) {
        this.allDirectories.push(directory);
      }
      this.directoryDetails.childDirectories.push(directory);
    } else if (directoryChange.action == ActionType.Edit) {
      let updatedChildDirectoryIndex =
        this.directoryDetails.childDirectories.findIndex(
          (obj) => obj.id === directory.id
        );
      if (updatedChildDirectoryIndex !== -1) {
        this.directoryDetails.childDirectories[
          updatedChildDirectoryIndex
        ].name = directory.name;
        this.directoryDetails.childDirectories[
          updatedChildDirectoryIndex
        ].accessLevel = directory.accessLevel;
      }
      this.updateAccessedDirectory();
      for (const accessedDirectory of this.accessedDirectories) {
        let subObjectIndexToUpdate =
          accessedDirectory.pathParentDirectories.findIndex(
            (obj) => obj.id === directory.id
          );
        if (subObjectIndexToUpdate !== -1) {
          accessedDirectory.pathParentDirectories[subObjectIndexToUpdate].name =
            directory.name;
          accessedDirectory.pathParentDirectories[
            subObjectIndexToUpdate
          ].accessLevel = directory.accessLevel;
        } else {
          subObjectIndexToUpdate = accessedDirectory.childDirectories.findIndex(
            (obj) => obj.id === directory.id
          );
          if (subObjectIndexToUpdate !== -1) {
            accessedDirectory.childDirectories[subObjectIndexToUpdate].name =
              directory.name;
            accessedDirectory.childDirectories[
              subObjectIndexToUpdate
            ].accessLevel = directory.accessLevel;
          }
        }
      }
    } else if (directoryChange.action == ActionType.Delete) {
      if (this.allDirectories) {
        this.allDirectories = this.allDirectories.filter(
          (x) => x.id !== directory.id
        );
      }
      const index = this.directoryDetails.childDirectories.findIndex(
        (obj) => obj.id === directory.id
      );
      if (index !== -1) {
        this.directoryDetails.childDirectories.splice(index, 1);
      }
      this.accessedDirectories = this.accessedDirectories.filter(
        (mainObj) =>
          !mainObj.pathParentDirectories.some(
            (subObj) => subObj.id === directory.id
          )
      );
    } else if (directoryChange.action == ActionType.Move) {
      const index = this.accessedDirectories.findIndex(
        (obj) => obj.id === directory.parentDirectoryId
      );
      if (index !== -1) {
        this.accessedDirectories[index].childDirectories =
          this.accessedDirectories[index].childDirectories.filter(
            (x) => x.id !== directory.id
          );
      }

      directory.parentDirectoryId = this.directoryDetails.id;   
      this.accessedDirectories = this.accessedDirectories.filter(
        (mainObj) =>
          !mainObj.pathParentDirectories.some(
            (subObj) => subObj.id === directory.id
          ) && mainObj.id !== directory.id
      );
      this.directoryDetails.childDirectories.push(directory);
      this.updateAccessedDirectory();
    }
  }

  updateAccessedDirectory() {
    const index = this.accessedDirectories.findIndex(
      (obj) => obj.id === this.directoryDetails.id
    );
    if (index !== -1) {
      this.accessedDirectories[index] = this.directoryDetails;
    }
  }

  toggleViewType($event) {
    const newVal = $event.detail.value == '1';
    if (!newVal && !this.allFiles) {
      forkJoin([
        this.fileService.getAllFiles(),
        this.directoryService.getAllDirectories(),
      ]).subscribe(([files, directories]) => {
        this.allFiles = files;
        this.allDirectories = directories.filter(
          (x) => x.name !== '$USER_ROOT'
        );
      });
    }
    this.viewHierarchy = newVal;
  }

  loadDirectory(directoryId: Guid) {
    const accessedDirectory = this.accessedDirectories.find(
      (x) => x.id === directoryId
    );

    this.viewHierarchy = true;

    if (accessedDirectory) {
      this.router.navigate(['/file/mine'], {
        queryParams: { id: directoryId },
      });
      this.directoryDetails = accessedDirectory;
      return;
    }
    this.directoryService
      .getDirectoryInfo(directoryId)
      .pipe(take(1))
      .subscribe((directory) => {
        this.router.navigate(['/file/mine'], {
          queryParams: { id: directoryId },
        });
        this.directoryDetails = directory;
        this.accessedDirectories.push(directory);
      });
  }

  getGuid(id) {
    return id ? Guid.parse(id) : Guid.createEmpty();
  }
}
