import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { ChartService } from 'src/app/core/services/chart.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { FileModel } from 'src/app/file/models/file.model';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { StatisticsModel } from '../../models/statistics.model';

@Component({
  selector: 'app-consumption-charts',
  templateUrl: './consumption-charts.component.html',
  styleUrls: ['./consumption-charts.component.scss'],
})
export class ConsumptionChartsComponent implements AfterViewInit {
  @Input() statistics: StatisticsModel;
  constructor(
    private chartService: ChartService
  ) {}

  get publicData() {
    return this.statistics.fileTypeStatistics.find(
      (x) => x.accessLevel === AccessLevel.Public
    );
  }

  get restrictedData() {
    return this.statistics.fileTypeStatistics.find(
      (x) => x.accessLevel === AccessLevel.Restricted
    );
  }

  get privateData() {
    return this.statistics.fileTypeStatistics.find(
      (x) => x.accessLevel === AccessLevel.Private
    );
  }

  get deletedData() {
    return this.statistics.fileTypeStatistics.find(
      (x) => x.accessLevel === AccessLevel.None
    );
  }

  ngAfterViewInit() {
    this.createSizeUsedChart();
    this.createFilesNumberChart();
    this.createSizeUsedLast30DaysChart();
    this.createFilesNumberLast30DaysChart();
  }

  createSizeUsedChart() {
    const data = [
      this.publicData.sizeMb * 1024 * 1024,
      this.restrictedData.sizeMb * 1024 * 1024,
      this.privateData.sizeMb * 1024 * 1024,
      this.deletedData.sizeMb * 1024 * 1024,
    ];
    this.chartService.createSizeChart(
      data,
      'doughnut',
      'storageUsage',
      '_management.storageUsage',
      true
    );
  }

  createFilesNumberChart() {
    const data = [
      this.publicData.number,
      this.restrictedData.number,
      this.privateData.number,
      this.deletedData.number,
    ];
    this.chartService.createNumberChart(
      data,
      'polarArea',
      'storageNumber',
      '_management.count',
      true
    );
  }

  createSizeUsedLast30DaysChart() {
    const data = [
      this.publicData.last30DaysAddedSizeMb * 1024 * 1024,
      this.restrictedData.last30DaysAddedSizeMb * 1024 * 1024,
      this.privateData.last30DaysAddedSizeMb * 1024 * 1024,
      this.deletedData.last30DaysAddedSizeMb * 1024 * 1024,
    ];
    this.chartService.createSizeChart(
      data,
      'doughnut',
      'storageLast30DaysUsage',
      '_management.storageUsage30Days',
      true
    );
  }

  createFilesNumberLast30DaysChart() {
    const data = [
      this.publicData.last30DaysAddedNumber,
      this.restrictedData.last30DaysAddedNumber,
      this.privateData.last30DaysAddedNumber,
      this.deletedData.last30DaysAddedNumber,
    ];
    this.chartService.createNumberChart(
      data,
      'polarArea',
      'storageLast30DaysNumber',
      '_management.count30Days',
      true
    );
  }
}
