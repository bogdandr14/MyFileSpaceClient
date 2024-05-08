import { FileTypeStatisticsModel } from './file-type-statistics.model';

export class StatisticsModel {
  fileTypeStatistics: FileTypeStatisticsModel[];
  sizeMbPastRetentionTime: number;
  cacheUsage: number;
}
