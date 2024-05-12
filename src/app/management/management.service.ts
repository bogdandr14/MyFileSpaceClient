import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../core/services/base.service';
import { DataService } from '../core/services/data.service';
import { MemoryUsedModel } from './models/memory-used.model';
import { StatisticsModel } from './models/statistics.model';

@Injectable({ providedIn: 'root' })
export class ManagementService extends BaseService {
  constructor(httpClient: HttpClient, private dataService: DataService) {
    super(httpClient, 'api/management', environment.baseApiUrl);
  }

  public getAllowedStorage(): Observable<MemoryUsedModel> {
    return super.getOneByPath<MemoryUsedModel>(
      'allowedStorage',
      null,
      BaseService.noLoadingConfig
    );
  }

  public getStatistics(
    internalRefresh: boolean = false
  ): Observable<StatisticsModel> {
    return super.getOneByPath<StatisticsModel>(
      'statistics',
      null,
      internalRefresh ? BaseService.noLoadingConfig : null
    );
  }

  public getCacheUsage(): Observable<MemoryUsedModel> {
    return super.getOneByPath<MemoryUsedModel>(
      'cacheUsage',
      null,
      BaseService.noLoadingConfig
    );
  }
  public clearCache() {
    const path = `${this.url}/cacheClear`;

    return this.http.delete(path);
  }

  public removePastRetentionTime() {
    const path = `${this.url}/pastRetention`;

    return this.http.delete(path);
  }
}
