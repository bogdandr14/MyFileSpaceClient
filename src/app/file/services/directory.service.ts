import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/services/base.service';
import { environment } from 'src/environments/environment';
import { DirectoryAddModel } from '../models/directory-add.model';
import { DirectoryModel } from '../models/directory.model';
import { DirectoryUpdateModel } from '../models/directory-update.model';
import { DirectoryDetailsModel } from '../models/directory-details.model';

@Injectable({ providedIn: 'root' })
export class DirectoryService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'api/directory', environment.baseApiUrl);
  }

  public getAllDirectories(): Observable<DirectoryModel[]> {
    return super.getAll<DirectoryModel>();
  }

  public getDirectoryInfo(
    directoryId: Guid,
    accessKey?: string
  ): Observable<DirectoryDetailsModel> {
    return super.getOneById<DirectoryDetailsModel>(directoryId, null, {
      accessKey: accessKey,
    });
  }

  public addDirectory(
    directoryCreate: DirectoryAddModel
  ): Observable<DirectoryModel> {
    return super.add<DirectoryModel>(directoryCreate);
  }

  public updateDirectory(
    directoryUpdate: DirectoryUpdateModel
  ): Observable<DirectoryModel> {
    return super.update<DirectoryModel>(directoryUpdate);
  }

  public moveDirectory(
    directoryId: Guid,
    parentDirectoryId: Guid
  ) {
    return super.update('move', directoryId.toString(), {
      newParentDirectoryId: parentDirectoryId.toString(),
    });
  }

  public restoreDirectory(
    directoryId: Guid,
    parentDirectoryId?: Guid
  ) {
    const params = {
      restore: true,
      newParentDirectoryId: parentDirectoryId
        ? parentDirectoryId.toString()
        : null,
    };

    return super.update('move', directoryId.toString(), params);
  }

  public deleteDirectory(directoryId: Guid, permanentDelete?: boolean) {
    return super.remove(directoryId, null, { permanent: permanentDelete });
  }
}
