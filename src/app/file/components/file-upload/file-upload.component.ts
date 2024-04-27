import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs/operators';
import { FileModel } from '../../models/file.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];

  @Output() fileSave = new EventEmitter<FileModel>();
  @Input() maxSizeMb = 2;
  @Input() directoryId: Guid;

  public originalImgFile: File;
  public originalImgUrl: string;

  constructor(
    public modalCtrl: ModalController,
    private fileService: FileService
  ) {}

  onFileChange(event) {
    this.originalImgFile = event.target.files[0];
    // if (this.originalImgFile.type.startsWith('image/')) {
    //   this.convertBlobToDataURI();
    // }
  }

  convertBlobToDataURI() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.originalImgUrl = reader.result as string;
    };
    reader.readAsDataURL(this.originalImgFile);
  }

  public getSize() {
    if (!this.originalImgFile) {
      return null;
    }
    let size = this.originalImgFile.size;
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${FileUploadComponent.sizes[i]}`;
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

  submitPhoto() {
    this.fileService
      .uploadFile(this.directoryId, this.originalImgFile)
      .pipe(take(1))
      .subscribe((imageFile) => {
        this.fileSave.emit(imageFile);
        this.dismiss();
      });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
