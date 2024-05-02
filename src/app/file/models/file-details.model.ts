import { Guid } from 'guid-typescript';
import { AccessKeyModel } from './access-key.model';
import { FileModel } from './file.model';

export class FileDetailsModel extends FileModel {
  directoryId: Guid;
  directoryName: string;
  isDeleted: boolean;
  accessKey: AccessKeyModel;
}
