import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { UiHelperService } from './ui-helper.service';

@Injectable({ providedIn: 'root' })
export class ChartService {
  constructor(
    private translateService: TranslateService,
    private uiHelperService: UiHelperService
  ) {}

  public createNumberChart(
    data: any[],
    type: keyof ChartTypeRegistry,
    chartId: string,
    title: string,
    showLegend = false
  ) {
    const storageChart = new Chart(chartId, {
      type: type,
      data: {
        labels: [
          this.translateService.instant('_accessLevel.public'),
          this.translateService.instant('_accessLevel.restricted'),
          this.translateService.instant('_accessLevel.private'),
          this.translateService.instant('_pages.bin'),
        ],
        datasets: [
          {
            data: data,
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
            text: this.translateService.instant(title),
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `${value} ${this.translateService.instant(
                  '_search.files'
                )}`;
              },
            },
          },
          legend: {
            display: showLegend,
          },
        },
      },
    });
  }

  public createSizeChart(
    data: any[],
    type: keyof ChartTypeRegistry,
    chartId: string,
    title: string,
    showLegend = false
  ) {
    const storageChart = new Chart(chartId, {
      type: type,
      data: {
        labels: [
          this.translateService.instant('_accessLevel.public'),
          this.translateService.instant('_accessLevel.restricted'),
          this.translateService.instant('_accessLevel.private'),
          this.translateService.instant('_pages.bin'),
        ],
        datasets: [
          {
            data: data,
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
            text: this.translateService.instant(title),
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
            display: showLegend,
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
