import { Guid } from 'guid-typescript';
import { AccessLevel } from '../../shared/models/access-level.enum';

export class DirectoryAddModel {
  constructor(parentId: Guid, name: string, accessLevel: AccessLevel) {
    this.parentDirectoryId = parentId;
    this.name = name;
    this.accessLevel = accessLevel;
  }
  name: string;
  parentDirectoryId?: Guid;
  accessLevel?: AccessLevel;
}
