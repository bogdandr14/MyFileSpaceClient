import { DirectoryModel } from '../../file/models/directory.model';
import { ActionType } from './action-type.enum';
import { ObjectType } from './object-type.enum';
import { FileModel } from '../..//file/models/file.model';

export class ObjectChangeModel {
  constructor(type: ObjectType, action: ActionType, object: any) {
    this.type = type;
    this.action = action;
    this.changedObject = object;
  }
  type: ObjectType;
  action: ActionType;
  changedObject: FileModel | DirectoryModel;
}
