import { Guid } from 'guid-typescript';
import { AccessLevel } from '../../shared/models/access-level.enum';

export class FileUpdateModel {
  fileId: Guid;
  name?: string;
  accessLevel?: AccessLevel;
}
