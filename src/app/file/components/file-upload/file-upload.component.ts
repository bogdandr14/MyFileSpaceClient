import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FileService } from '../../services/file.service';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs/operators';
import { FileModel } from '../../models/file.model';
import { ModalController, Platform } from '@ionic/angular';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { DOCUMENT } from '@angular/common';
import { AccessLevel } from '../../../shared/models/access-level.enum';
import { AlertService } from '../../../core/services/alert.service';
import { DataService } from '../../../core/services/data.service';
import { ObjectChangeModel } from '../../../core/models/object-change.model';
import { ObjectType } from '../../../core/models/object-type.enum';
import { ActionType } from '../../../core/models/action-type.enum';
import { Observable } from 'rxjs';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];

  @Output() fileSave = new EventEmitter<FileModel>();
  @Input() maxSizeMb = 2;
  @Input() directoryId: Guid;
  @Input() fileId: Guid;
  @Input() isUpdate = false;

  public fileToUpload: File;
  public accessLevel: AccessLevel = AccessLevel.Private;
  public readMode = ReadMode.DataURL;
  public isMobile: boolean;
  @ViewChild('form') form: any;

  // public fileImgUrl: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private modalCtrl: ModalController,
    private fileService: FileService,
    private platform: Platform,
    private alertService: AlertService,
    private dataService: DataService,
    private uiHelperService: UiHelperService
  ) {}

  ngOnInit(): void {
    this.isMobile =
      this.platform.is('mobile') ||
      this.document.documentElement.clientWidth < 768;
  }

  addFile(file: ReadFile) {
    this.form.control.touched = true;
    this.form.control.pristine = false;
    this.fileToUpload = file.underlyingFile;
  }

  onFileChange(event) {
    this.fileToUpload = event.target.files[0];
    // if (this.originalImgFile.type.startsWith('image/')) {
    //   this.convertBlobToDataURI();
    // }
  }

  // convertBlobToDataURI() {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     this.fileImgUrl = reader.result as string;
  //   };
  //   reader.readAsDataURL(this.fileToUpload);
  // }

  public get size() {
    if (!this.fileToUpload) {
      return null;
    }
    return this.uiHelperService.computeSize(this.fileToUpload.size);
  }

  // dataURItoBlob(dataURI: string) {
  //   const byteString = window.atob(dataURI);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const int8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     int8Array[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([int8Array], { type: this.originalImgFile.type });
  //   return blob;
  // }

  submitFile() {
    let observable: Observable<FileModel>;
    let actionType: ActionType;
    if (this.isUpdate) {
      observable = this.fileService.updateUploadFile(
        this.fileId,
        this.fileToUpload
      );
      actionType = ActionType.Edit;
    } else {
      observable = this.fileService.uploadFile(
        this.directoryId,
        this.accessLevel,
        this.fileToUpload
      );
      actionType = ActionType.Add;
    }
    observable.pipe(take(1)).subscribe(
      (uploadedFile) => {
        this.fileSave.emit(uploadedFile);
        this.dataService.triggerObjectChange(
          new ObjectChangeModel(ObjectType.File, actionType, uploadedFile)
        );
        this.alertService.showSuccess('_message._success.fileUpload');
        this.dismiss();
      },
      (error) => this.alertService.showError(error)
    );
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
