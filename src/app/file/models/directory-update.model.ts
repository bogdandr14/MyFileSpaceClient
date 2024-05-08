import { Guid } from 'guid-typescript';
import { AccessLevel } from '../../shared/models/access-level.enum';

export class DirectoryUpdateModel {
  constructor(id: Guid, name?: string, accessLevel?: AccessLevel) {
    this.DirectoryId = id;
    this.name = name;
    this.accessLevel = accessLevel;
  }
  DirectoryId: Guid;
  name?: string;
  accessLevel?: AccessLevel;
}
