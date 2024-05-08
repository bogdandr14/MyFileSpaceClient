import { DirectoryModel } from 'src/app/file/models/directory.model';
import { FileModel } from 'src/app/file/models/file.model';
import { UserDetailsModel } from './user-details.model';

export class CurrentUserModel extends UserDetailsModel {
  email: string;
  lastPasswordChange: Date;
  roleType: number;
  allowedFiles: FileModel[];
  allowedDirectories: DirectoryModel[];
}
