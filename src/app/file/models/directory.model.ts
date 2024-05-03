import { Guid } from 'guid-typescript';
import { AccessLevel } from '../../shared/models/access-level.enum';

export class DirectoryModel {
  id: Guid;
  name: string;
  parentDirectoryId: Guid;
  accessLevel: AccessLevel;
  ownerId: Guid;
  createdAt: Date;
  modifiedAt: Date;
  isDeleted: boolean;
}
