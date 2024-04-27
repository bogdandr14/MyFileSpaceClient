import { Component, Input } from '@angular/core';
import { FileModel } from '../../models/file.model';
import { MenuController } from '@ionic/angular';
import { FileService } from '../../services/file.service';
import { take } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class FileItemComponent {
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];
  @Input() file: FileModel;
  constructor(
    private menuCtrl: MenuController,
    private fileService: FileService
  ) {}
  openDetailsMenu() {
    this.menuCtrl.open('details-menu');
  }
  get size() {
    let size = this.file.sizeInBytes;
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${FileItemComponent.sizes[i]}`;
  }

  get fileIcon() {
    if (
      this.file.contentType.includes('octet-stream') ||
      this.file.contentType.includes('zip') ||
      this.file.contentType.includes('compressed')
    ) {
      return 'file-tray-full';
    }
    if (this.file.contentType.includes('image')) {
      return 'image';
    }
    if (this.file.contentType.includes('video')) {
      return 'film';
    }
    if (this.file.contentType.includes('text')) {
      return 'document-text';
    }
    return 'document';
  }
  public downloadFile() {
    this.fileService
      .downloadFile(this.file.id)
      .pipe(take(1))
      .subscribe((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = this.file.name;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }, 100);
      });
  }

  getFileNameFromResponse(response: HttpResponse<Blob>): string | null {
    const contentDispositionHeader = response.headers.get(
      'content-disposition'
    );
    if (contentDispositionHeader) {
      const matches = contentDispositionHeader.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (matches && matches.length > 1) {
        const filename = matches[1].replace(/['"]/g, '');
        return decodeURIComponent(filename);
      }
    }
    return null;
  }
}
