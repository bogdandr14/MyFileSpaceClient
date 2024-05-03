import { DirectoryModel } from 'src/app/file/models/directory.model';
import { FileModel } from 'src/app/file/models/file.model';
import { UserModel } from './user.model';

export class UserDetailsModel extends UserModel {
  directories: DirectoryModel[];
  files: FileModel[];
}
