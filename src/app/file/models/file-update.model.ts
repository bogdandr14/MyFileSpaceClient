import { Guid } from 'guid-typescript';
import { AccessLevel } from '../../shared/models/access-level.enum';

export class FileUpdateModel {
  constructor(id: Guid, name?: string, accessLevel?: AccessLevel) {
    this.fileId = id;
    this.name = name;
    this.accessLevel = accessLevel;
  }
  fileId: Guid;
  name?: string;
  accessLevel?: AccessLevel;
}
