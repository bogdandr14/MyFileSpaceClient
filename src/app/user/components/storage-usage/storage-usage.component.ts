import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { FileModel } from 'src/app/file/models/file.model';

@Component({
  selector: 'app-storage-usage',
  templateUrl: './storage-usage.component.html',
  styleUrls: ['./storage-usage.component.scss'],
})
export class StorageUsageComponent implements AfterViewInit {
  @Input() files: FileModel[];
  @Input() maxStorage = 4294967296;
  constructor(
    private uiHelperService: UiHelperService,
    private translateService: TranslateService
  ) {}

  get publicData() {
    return this.files
      .filter((x) => !x.isDeleted && x.accessLevel === 3)
      .reduce((acc, obj) => acc + obj.sizeInBytes, 0);
  }

  get restrictedData() {
    return this.files
      .filter((x) => !x.isDeleted && x.accessLevel === 2)
      .reduce((acc, obj) => acc + obj.sizeInBytes, 0);
  }

  get privateData() {
    return this.files
      .filter((x) => !x.isDeleted && x.accessLevel === 1)
      .reduce((acc, obj) => acc + obj.sizeInBytes, 0);
  }

  get deletedData() {
    return this.files
      .filter((x) => x.isDeleted)
      .reduce((acc, obj) => acc + obj.sizeInBytes, 0);
  }

  get unusedData() {
    return (
      this.maxStorage -
      this.files.reduce((acc, obj) => acc + obj.sizeInBytes, 0)
    );
  }
  ngAfterViewInit() {
    this.createPieChart();
  }

  createPieChart() {
    const canvas: HTMLCanvasElement = document.getElementById(
      'storageChart'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const storageChart = new Chart('storageChart', {
      type: 'doughnut',
      data: {
        labels: [
          this.translateService.instant('_accessLevel.public'),
          this.translateService.instant('_accessLevel.restricted'),
          this.translateService.instant('_accessLevel.private'),
          this.translateService.instant('_pages.bin'),
        ],
        datasets: [
          {
            data: [
              this.publicData,
              this.restrictedData,
              this.privateData,
              this.deletedData,
            ],
            backgroundColor: [
              'rgb(57, 202, 90)',
              'rgb(27, 157, 243)',
              'rgb(121, 62, 255)',
              'rgb(252, 0, 22)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.translateService.instant('_file.storageUsage'),
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return this.uiHelperService.computeSize(value as number);
              },
            },
          },
          legend: {
            display: false,
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                const datasets = data.datasets;
                const labels = data.labels;

                if (datasets.length && labels.length) {
                  return labels.map((label, i) => {
                    const value = datasets[0].data[i];
                    return {
                      text: this.uiHelperService.computeSize(value as number),
                      fillStyle: datasets[0].backgroundColor[i],
                    };
                  });
                }
                return [];
              },
            },
          },
        },
      },
    });
  }
}
