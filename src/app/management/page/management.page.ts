import { Component, OnDestroy, OnInit } from '@angular/core';
import { startWith, switchMap, tap } from 'rxjs';
import { interval } from 'rxjs';
import { Subscription, take } from 'rxjs';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { ManagementService } from '../management.service';
import { MemoryUsedModel } from '../models/memory-used.model';
import { StatisticsModel } from '../models/statistics.model';

@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.scss'],
})
export class ManagementPage implements OnInit, OnDestroy {
  private subscription: Subscription;

  public statistics: StatisticsModel;
  public cacheUsage: MemoryUsedModel;
  public get memoryUsed() {
    return this.cacheUsage
      ? `${this.cacheUsage.size.toFixed(2)} ${this.cacheUsage.scale}`
      : '';
  }
  constructor(
    private managementService: ManagementService,
    public uiHelper: UiHelperService
  ) {}
  private initialLoadObservable(internalRefresh: boolean) {
    return this.managementService.getStatistics(internalRefresh).pipe(
      take(1),
      tap((respone) => (this.statistics = respone))
    );
  }

  ngOnInit() {
    this.initialLoadObservable(false).subscribe();

    this.subscription = interval(10000) // 10 seconds
      .pipe(
        startWith(0),
        switchMap(() => this.managementService.getCacheUsage())
      )
      .subscribe((response) => (this.cacheUsage = response));
  }

  handleRefresh(event) {
    this.initialLoadObservable(true).subscribe(() => {
      event.target.complete();
    });
  }

  deleteFilesPastRetention() {
    this.managementService.removePastRetentionTime().pipe(take(1)).subscribe();
  }

  clearCache() {
    this.managementService.clearCache().pipe(take(1)).subscribe();
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    this.subscription.unsubscribe();
  }
}
