import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { forkJoin, tap } from 'rxjs';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { ObjectChangeModel } from 'src/app/core/models/object-change.model';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { DataService } from 'src/app/core/services/data.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { DirectoryDetailsModel } from 'src/app/file/models/directory-details.model';
import { DirectoryModel } from 'src/app/file/models/directory.model';
import { FileModel } from 'src/app/file/models/file.model';
import { DirectoryService } from 'src/app/file/services/directory.service';
import { FileService } from 'src/app/file/services/file.service';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.page.html',
  styleUrls: ['./bin.page.scss'],
})
export class BinPage implements OnInit {
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];
  public isReloading = false;
  public deletedFiles: FileModel[];
  public deletedDirectories: DirectoryModel[];
  public binPseudoDirectory: DirectoryDetailsModel;
  public directorySizes: { id: Guid; size: number }[] = [];
  public viewHierarchy = true;
  constructor(
    private fileService: FileService,
    private directoryService: DirectoryService,
    private dataService: DataService,
    private uiHelper: UiHelperService
  ) {}

  get totalSize() {
    let size = this.deletedFiles.reduce((acc, obj) => acc + obj.sizeInBytes, 0);
    return this.uiHelper.computeSize(size);
  }

  private initialLoadObservable(internalRefresh: boolean) {
    return forkJoin([
      this.fileService.getAllFiles(true, internalRefresh),
      this.directoryService.getAllDirectories(true, internalRefresh),
    ]).pipe(
      tap(([files, directories]) => {
        this.deletedFiles = files;
        this.deletedDirectories = directories;
        this.createBinDirectory();
        this.computeDirectorySize();
      })
    );
  }

  private createBinDirectory() {
    this.binPseudoDirectory = new DirectoryDetailsModel();
    this.binPseudoDirectory.isDeleted = true;
    this.binPseudoDirectory.accessLevel = AccessLevel.Private;
    this.binPseudoDirectory.childDirectories = this.deletedDirectories.filter(
      (x) => !this.deletedDirectories.some((y) => y.id == x.parentDirectoryId)
    );
    this.binPseudoDirectory.files = this.deletedFiles.filter(
      (x) => !this.deletedDirectories.some((y) => y.id == x.directoryId)
    );
  }

  private computeDirectorySize() {
    const filesInDirectories = this.deletedFiles.filter(
      (x) => !this.binPseudoDirectory.files.some((y) => y.id === x.id)
    );

    for (const file of filesInDirectories) {
      let directoryIndex = this.deletedDirectories.findIndex(
        (d) => d.id === file.directoryId
      );
      let lastDirectoryIndex;
      while (directoryIndex !== -1) {
        lastDirectoryIndex = directoryIndex;
        directoryIndex = this.deletedDirectories.findIndex(
          (d) =>
            d.id ===
            this.deletedDirectories[lastDirectoryIndex].parentDirectoryId
        );
      }

      const lastDirectoryId = this.deletedDirectories[lastDirectoryIndex].id;
      const computedSizeIndex = this.directorySizes.findIndex(
        (ds) => ds.id === lastDirectoryId
      );
      if (computedSizeIndex === -1) {
        this.directorySizes.push({
          id: lastDirectoryId,
          size: file.sizeInBytes,
        });
      } else {
        this.directorySizes[computedSizeIndex].size += file.sizeInBytes;
      }
    }
  }

  ngOnInit() {
    this.initialLoadObservable(false).subscribe();
    this.dataService.objectChange$.subscribe((objectChange) => {
      this.handleObjectChange(objectChange);
    });
  }

  handleRefresh(event) {
    this.isReloading = true;
    this.directorySizes = [];
    this.initialLoadObservable(true).subscribe(() => {
      this.isReloading = false;
      event.target.complete();
    });
  }

  private handleObjectChange(objectChange: ObjectChangeModel) {
    if (objectChange.type == ObjectType.Directory) {
      this.handleDirectoryChange(objectChange);
    }

    if (objectChange.type == ObjectType.File) {
      this.handleFileChange(objectChange);
    }
  }

  private handleDirectoryChange(directoryChange: ObjectChangeModel) {
    const directory = directoryChange.changedObject as DirectoryModel;
    if (
      directoryChange.action == ActionType.Delete ||
      directoryChange.action == ActionType.Restore
    ) {
      this.deletedDirectories = this.deletedDirectories.filter(
        (x) => x.id !== directory.id
      );
      this.binPseudoDirectory.childDirectories =
        this.binPseudoDirectory.childDirectories.filter(
          (obj) => obj.id !== directory.id
        );
      this.deletedDirectories = this.deletedDirectories.filter(
        (obj) => obj.id !== directory.id
      );
    }
  }

  private handleFileChange(fileChange: ObjectChangeModel) {
    const file = fileChange.changedObject as FileModel;
    if (
      fileChange.action == ActionType.Delete ||
      fileChange.action == ActionType.Restore
    ) {
      this.deletedFiles = this.deletedFiles.filter((x) => x.id !== file.id);

      this.binPseudoDirectory.files = this.binPseudoDirectory.files.filter(
        (obj) => obj.id !== file.id
      );
      this.deletedFiles = this.deletedFiles.filter((obj) => obj.id !== file.id);
    }
  }

  toggleViewType($event) {
    this.viewHierarchy = $event.detail.value == '1';
  }
}
