import { Guid } from 'guid-typescript';
import { AccessLevel } from '../../shared/models/access-level.enum';

export class FileModel {
  id: Guid;
  name: string;
  accessLevel: AccessLevel;
  sizeInBytes: number;
  contentType: string;
  directoryId: Guid;
  ownerId: Guid;
  createdAt: Date;
  modifiedAt: Date;
  isDeleted: boolean;
}
