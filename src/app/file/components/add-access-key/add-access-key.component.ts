import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs';
import { AccessObjectModel } from 'src/app/core/models/access-object.model';
import { ActionType } from 'src/app/core/models/action-type.enum';
import { ObjectChangeModel } from 'src/app/core/models/object-change.model';
import { ObjectType } from 'src/app/core/models/object-type.enum';
import { AlertService } from 'src/app/core/services/alert.service';
import { DataService } from 'src/app/core/services/data.service';
import { AccessKeyAddModel } from '../../models/access-key-add.model';
import { FileUpdateModel } from '../../models/file-update.model';
import { AccessService } from '../../services/access.service';

@Component({
  selector: 'app-add-access-key',
  templateUrl: './add-access-key.component.html',
  styleUrls: ['./add-access-key.component.scss'],
})
export class AddAccessKeyComponent {
  @Input() accessObject: AccessObjectModel;
  @Input() objectName: string;
  @Output() accessKeyAdded = new EventEmitter();

  get isFile() {
    return this.accessObject.objectType == ObjectType.File;
  }

  public expiresAt : Date;
  constructor(
    public modalCtrl: ModalController,
    private accessService: AccessService,
    private alertService: AlertService
  ) {}

  onSubmit() {
    debugger;
    const c = new AccessKeyAddModel(this.accessObject.objectType, this.accessObject.objectId);
    c.expiresAt = this.expiresAt;
    this.accessService
      .addAccessKey(c)
      .pipe(take(1))
      .subscribe((key) => {
        this.accessKeyAdded.emit(key);
        this.alertService.showSuccess('_message._success.addAccessKey');

        this.dismiss();
      });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
