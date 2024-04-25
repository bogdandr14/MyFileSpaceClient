import { Guid } from 'guid-typescript';
import { FileModel } from './file.model';

export class FileDetailsModel extends FileModel {
  directoryId: Guid;
  directoryName: string;
  isDeleted: boolean;
}
