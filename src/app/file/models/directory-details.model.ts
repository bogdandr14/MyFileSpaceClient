import { AccessKeyModel } from "./access-key.model";
import { DirectoryModel } from "./directory.model";
import { FileModel } from "./file.model";

export class DirectoryDetailsModel extends DirectoryModel{
  ownerTagName: string;
  childDirectories: DirectoryModel[];
  pathParentDirectories: DirectoryModel[];
  files: FileModel[];
  allowedUsers: string[];
  accessKey: AccessKeyModel;
}
