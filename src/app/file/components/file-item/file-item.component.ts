import { Component, Input } from '@angular/core';
import { FileModel } from '../../models/file.model';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class FileItemComponent {
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];
  @Input() file: FileModel;
  constructor() {}

  public getSize() {
    let size = this.file.sizeInBytes;
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${FileItemComponent.sizes[i]}`;
  }
}
