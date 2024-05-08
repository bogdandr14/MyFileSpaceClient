import { DirectoryModel } from '../../file/models/directory.model';
import { FileModel } from '../../file/models/file.model';
import { ObjectType } from './object-type.enum';

export class ObjectMoveModel {
  constructor(type: ObjectType, object: FileModel | DirectoryModel) {
    this.type = type;
    this.cutObject = object;
  }
  type: ObjectType;
  cutObject: FileModel | DirectoryModel;
}
