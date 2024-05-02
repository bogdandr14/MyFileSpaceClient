import { Guid } from 'guid-typescript';
import { ObjectType } from 'src/app/core/models/object-type.enum';

export class UserAccessUpdateModel {
  objectId: Guid;
  objectType: ObjectType;
  addUserIds: Guid[];
  removeUserIds: Guid[];
}
