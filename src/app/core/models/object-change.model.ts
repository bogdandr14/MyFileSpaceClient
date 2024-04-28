import { ActionType } from './action-type.enum';
import { ObjectType } from './object-type.enum';

export class ObjectChangeModel {
  constructor(type: ObjectType, action: ActionType, object: any) {
    this.type = type;
    this.action = action;
    this.changedObject = object;
  }
  type: ObjectType;
  action: ActionType;
  changedObject: any;
}
