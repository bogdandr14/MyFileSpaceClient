import { FileModel } from 'src/app/file/models/file.model';

export class FoundFilesModel {
  constructor() {
    this.items = [];
    this.skipped = 0;
    this.taken = 0;
    this.areLast = true;
  }
  items: FileModel[];
  skipped: number;
  taken: number;
  areLast: boolean;
}
