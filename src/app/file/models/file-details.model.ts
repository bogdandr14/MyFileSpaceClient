import { AccessKeyModel } from './access-key.model';
import { FileModel } from './file.model';

export class FileDetailsModel extends FileModel {
  ownerTagName: string;
  directoryName: string;
  accessKey: AccessKeyModel;
  allowedUsers: string[];
}
