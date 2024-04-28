import { DataService } from './../../../core/services/data.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { iif, take } from 'rxjs';
import { DirectoryAddModel } from '../../models/directory-add.model';
import { DirectoryModel } from '../../models/directory.model';
import { DirectoryService } from '../../services/directory.service';
import { DirectoryUpdateModel } from '../../models/directory-update.model';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { ObjectChangeModel } from 'src/app/core/models/object-change.model';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-directory-edit',
  templateUrl: './directory-edit.component.html',
  styleUrls: ['./directory-edit.component.scss'],
})
export class DirectoryEditComponent {
  @Output() directorySave = new EventEmitter<DirectoryModel>();
  @Input() parentDirectoryId: Guid;
  @Input() isUpdate = false;
  @Input() set directoryToUpdate(val: DirectoryModel) {
    this.accessLevel = val.accessLevel;
    this.name = val.name;
  }

  private existingDirectoryId: Guid;
  public accessLevel: AccessLevel = AccessLevel.Private;
  public name: string;

  constructor(
    public modalCtrl: ModalController,
    private directoryService: DirectoryService,
    private dataService: DataService,
    private alertService: AlertService
  ) {}

  onSubmit() {
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
        this.directorySave.emit(directory);

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

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
