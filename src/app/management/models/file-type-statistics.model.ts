import { AccessLevel } from 'src/app/shared/models/access-level.enum';

export class FileTypeStatisticsModel {
  accessLevel: AccessLevel;
  sizeMb: number;
  number: number;
  last30DaysAddedSizeMb: number;
  last30DaysAddedNumber: number;
}
