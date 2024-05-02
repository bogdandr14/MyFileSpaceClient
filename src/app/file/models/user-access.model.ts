import { Guid } from 'guid-typescript';
import { UserModel } from 'src/app/user/models/user.model';

export class UserAccessModel extends UserModel {
  constructor(id: Guid, tagName: string) {
    super();
    this.userId = id;
    this.tagName = tagName;
    this.isRemoved = false;
  }
  isRemoved: boolean;
}
