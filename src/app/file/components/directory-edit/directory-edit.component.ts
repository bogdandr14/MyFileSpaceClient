import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { iif, take } from 'rxjs';
import { DirectoryAddModel } from '../../models/directory-add.model';
import { DirectoryModel } from '../../models/directory.model';
import { DirectoryService } from '../../services/directory.service';
import { DirectoryUpdateModel } from '../../models/directory-update.model';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';

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
  public accessLevel: AccessLevel;
  public name: string;

  constructor(
    public modalCtrl: ModalController,
    private directoryService: DirectoryService
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
        this.dismiss();
      });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
