import { Guid } from 'guid-typescript';
import { ObjectType } from './object-type.enum';

export class AccessObjectModel {
  constructor(objectType: ObjectType, objectId: Guid) {
    this.objectType = objectType;
    this.objectId = objectId;
  }
  objectType: ObjectType;
  objectId: Guid;
}
