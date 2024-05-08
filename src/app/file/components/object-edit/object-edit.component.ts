import { DataService } from '../../../core/services/data.service';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { iif, take } from 'rxjs';
import { DirectoryAddModel } from '../../models/directory-add.model';
import { DirectoryModel } from '../../models/directory.model';
import { DirectoryService } from '../../services/directory.service';
import { DirectoryUpdateModel } from '../../models/directory-update.model';
import { AccessLevel } from '../../../shared/models/access-level.enum';
import { ObjectChangeModel } from '../../../core/models/object-change.model';
import { ActionType } from '../../../core/models/action-type.enum';
import { ObjectType } from '../../../core/models/object-type.enum';
import { AlertService } from '../../../core/services/alert.service';
import { FileModel } from '../../models/file.model';
import { FileService } from '../../services/file.service';
import { FileUpdateModel } from '../../models/file-update.model';

@Component({
  selector: 'app-object-edit',
  templateUrl: './object-edit.component.html',
  styleUrls: ['./object-edit.component.scss'],
})
export class ObjectEditComponent {
  @Input() parentDirectoryId: Guid;
  @Input() isUpdate = false;
  @Input() isFile = false;
  @Input() set toUpdate(val: DirectoryModel | FileModel) {
    this.existingDirectoryId = val.id;
    this.accessLevel = val.accessLevel;
    this.name = val.name;
  }

  private existingDirectoryId: Guid;
  public accessLevel: AccessLevel = AccessLevel.Private;
  public name: string;
  public get objectLabel(): string {
    return this.isFile === true ? '_file.name' : '_directory.name';
  }

  constructor(
    public modalCtrl: ModalController,
    private directoryService: DirectoryService,
    private fileService: FileService,
    private dataService: DataService,
    private alertService: AlertService
  ) {}

  onSubmit() {
    if (this.isFile && this.isUpdate) {
      this.fileService
        .updateFile(
          new FileUpdateModel(
            this.existingDirectoryId,
            this.name,
            this.accessLevel
          )
        )
        .pipe(take(1))
        .subscribe((file) => {
          this.dataService.triggerObjectChange(
            new ObjectChangeModel(ObjectType.File, ActionType.Edit, file)
          );
          this.alertService.showSuccess('_message._success.fileEdit');

          this.dismiss();
        });
    } else {
      iif(
        () => this.isUpdate,
        this.directoryService.updateDirectory(
          new DirectoryUpdateModel(
            this.existingDirectoryId,
            this.name,
            this.accessLevel
          )
        ),
        this.directoryService.addDirectory(
          new DirectoryAddModel(
            this.parentDirectoryId,
            this.name,
            this.accessLevel
          )
        )
      )
        .pipe(take(1))
        .subscribe((directory) => {
          this.dataService.triggerObjectChange(
            new ObjectChangeModel(
              ObjectType.Directory,
              this.isUpdate ? ActionType.Edit : ActionType.Add,
              directory
            )
          );
          this.alertService.showSuccess(
            '_message._success.directory' + (this.isUpdate ? 'Edit' : 'Add')
          );

          this.dismiss();
        });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
