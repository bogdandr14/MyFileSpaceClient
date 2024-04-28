import { ObjectChangeModel } from './../../core/models/object-change.model';
import { DataService } from './../../core/services/data.service';
import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../services/directory.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, iif, take, tap, of } from 'rxjs';
import { DirectoryDetailsModel } from '../models/directory-details.model';
import { Guid } from 'guid-typescript';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { FileModel } from '../models/file.model';
import { Action } from 'rxjs/internal/scheduler/Action';
import { DirectoryModel } from '../models/directory.model';

@Component({
  selector: 'app-file',
  templateUrl: './file.page.html',
  styleUrls: ['./file.page.scss'],
})
export class FilePage implements OnInit {
  public directoryDetails: DirectoryDetailsModel;
  private accessedDirectories: DirectoryDetailsModel[] = [];
  private accessKey: string;
  constructor(
    private directoryService: DirectoryService,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          iif<Guid, Guid>(
            () => !!params.get('id'),
            of(this.getGuid(params.get('id'))),
            this.directoryService
              .getAllDirectories()
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
          this.directoryService.getDirectoryInfo(directoryGuid)
        )
      )
      .pipe(take(1))
      .subscribe((directory) => {
        this.directoryDetails = directory;
        this.accessedDirectories.push(directory);
      });

    this.dataService.objectChange$.subscribe((objectChange) => {
      this.handleObjectChange(objectChange);
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
      const index = this.directoryDetails.files.findIndex(
        (obj) => obj.id === file.id
      );
      if (index !== -1) {
        this.directoryDetails.files.splice(index, 1);
      }
    } else if (fileChange.action == ActionType.Move) {
      this.directoryDetails.files.push(file);
      for (const accessedDirectory of this.accessedDirectories) {
        const subObjectIndexToRemove = accessedDirectory.files.findIndex(
          (obj) => obj.id === file.id
        );
        if (subObjectIndexToRemove !== -1) {
          accessedDirectory.files.splice(subObjectIndexToRemove, 1);
          break; // Stop the loop after removing the sub-object
        }
      }
    }
    this.updateAccessedDirectory();
  }

  updateAccessedDirectory() {
    const index = this.accessedDirectories.findIndex(
      (obj) => obj.id === this.directoryDetails.id
    );
    if (index !== -1) {
      this.accessedDirectories[index] = this.directoryDetails;
    }
  }

  handleDirectoryChange(directoryChange: ObjectChangeModel) {
    const directory = directoryChange.changedObject as DirectoryModel;
    if (directoryChange.action == ActionType.Add) {
      this.directoryDetails.childDirectories.push(directory);
    } else if (directoryChange.action == ActionType.Edit) {
      this.directoryDetails.name = directory.name;
      this.directoryDetails.accessLevel = directory.accessLevel;
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
      this.directoryDetails.childDirectories.push(directory);
      this.updateAccessedDirectory();
      this.accessedDirectories = this.accessedDirectories.filter(
        (mainObj) =>
          !mainObj.pathParentDirectories.some(
            (subObj) => subObj.id === directory.id
          )
      );
    }
  }

  loadDirectory(directoryId: Guid) {
    const accessedDirectory = this.accessedDirectories.find(
      (x) => x.id === directoryId
    );
    if (accessedDirectory) {
      this.directoryDetails = accessedDirectory;
      return;
    }
    this.directoryService
      .getDirectoryInfo(directoryId)
      .pipe(take(1))
      .subscribe((directory) => {
        this.directoryDetails = directory;
        this.accessedDirectories.push(directory);
      });
  }

  getGuid(id) {
    return id ? Guid.parse(id) : Guid.createEmpty();
  }
}
