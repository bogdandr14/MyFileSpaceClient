import { Component, OnInit } from '@angular/core';
import { FileModel } from '../../models/file.model';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { ObjectChangeModel } from 'src/app/core/models/object-change.model';
import { DataService } from 'src/app/core/services/data.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { FileService } from '../../services/file.service';
import { UserService } from 'src/app/user/user.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  public favoritePseudoDirectory: DirectoryDetailsModel;
  constructor(
    private fileService: FileService,
    private dataService: DataService,
    private uiHelper: UiHelperService,
    private userService: UserService
  ) {}

  get totalSize() {
    let size = this.favoritePseudoDirectory.files.reduce(
      (acc, obj) => acc + obj.sizeInBytes,
      0
    );
    return this.uiHelper.computeSize(size);
  }

  private initialLoadObservable(internalRefresh: boolean) {
    return this.fileService
      .getAllFavorites(internalRefresh)
      .pipe(tap((files) => this.createFavoriteDirectory(files)));
  }

  private createFavoriteDirectory(files: FileModel[]) {
    this.favoritePseudoDirectory = new DirectoryDetailsModel();
    this.favoritePseudoDirectory.accessLevel = AccessLevel.Private;
    const currentUserId = this.userService.getUserId();
    this.favoritePseudoDirectory.files = files.filter((x) =>
      x.watchingUsers.some((y) => y == currentUserId)
    );
  }

  ngOnInit() {
    this.initialLoadObservable(false).subscribe();
    this.dataService.objectChange$.subscribe((objectChange) => {
      this.handleFileChange(objectChange);
    });
  }

  handleRefresh(event) {
    this.initialLoadObservable(true).subscribe(() => event.target.complete());
  }

  handleFileChange(fileChange: ObjectChangeModel) {
    const file = fileChange.changedObject as FileModel;
    if (fileChange.action == ActionType.Edit) {
      this.favoritePseudoDirectory.files =
        this.favoritePseudoDirectory.files.filter((obj) => obj.id !== file.id);
    }
  }
}
