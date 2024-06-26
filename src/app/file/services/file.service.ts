import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/services/base.service';
import { environment } from 'src/environments/environment';
import { FileModel } from '../models/file.model';
import { FileDetailsModel } from '../models/file-details.model';
import { FileUpdateModel } from '../models/file-update.model';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { FoundFilesModel } from 'src/app/browse/models/found-files.model';
import { InfiniteScrollFilter } from 'src/app/shared/models/infinite-scroll.filter';

@Injectable({ providedIn: 'root' })
export class FileService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'api/storedfile', environment.baseApiUrl);
  }

  public getAllFiles(
    deleted?: boolean,
    internalRefresh: boolean = false
  ): Observable<FileModel[]> {
    const params = !!deleted
      ? {
          deleted,
        }
      : {};
    return super.getAll<FileModel>(
      params,
      internalRefresh ? BaseService.noLoadingConfig : null
    );
  }

  public findFiles(filter: InfiniteScrollFilter) {
    return super.getOneByPath<FoundFilesModel>(
      `search/${this.turnFilterIntoUrl(filter)}`
    );
  }

  public getAllFavorites(internalRefresh: boolean = false) {
    return super.getMany<FileModel>(
      'favorite',
      null,
      internalRefresh ? BaseService.noLoadingConfig : null
    );
  }

  public getFileInfo(
    fileId: Guid,
    accessKey?: string,
    internalRefresh: boolean = false
  ): Observable<FileDetailsModel> {
    return super.getOneById<FileDetailsModel>(
      fileId,
      null,
      {
        accessKey: accessKey,
      },
      internalRefresh ? BaseService.noLoadingConfig : null
    );
  }

  public uploadFile(
    directoryId: Guid,
    accessLevel: AccessLevel,
    file: File
  ): Observable<FileModel> {
    const path = `${this.url}/upload/${directoryId}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accessLevel', accessLevel.toString());
    return this.httpClient.post<FileModel>(path, formData);
  }

  public updateUploadFile(fileId: Guid, file: File): Observable<FileModel> {
    const path = `${this.url}/upload/${fileId}`;
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.put<FileModel>(path, formData);
  }

  public updateFile(fileUpdate: FileUpdateModel): Observable<FileModel> {
    return super.update<FileModel>(fileUpdate);
  }

  public downloadFile(fileId: Guid, accessKey?: string): Observable<any> {
    const params = !!accessKey
      ? {
          accessKey,
        }
      : {};
    return this.http.get(
      `${environment.baseApiUrl}/api/storedfile/download/${fileId}`,
      { responseType: 'blob', params: params }
    );
  }

  public moveFile(fileId: Guid, directoryId: Guid) {
    return super.update(null, `move/${fileId.toString()}`, {
      directoryId: directoryId.toString(),
    });
  }

  public addFavorite(fileId: Guid) {
    return super.add(
      null,
      `favorite/${fileId.toString()}`,
      null,
      BaseService.noLoadingConfig
    );
  }

  public removeFavorite(fileId: Guid) {
    return super.remove(fileId, `favorite`, null, BaseService.noLoadingConfig);
  }

  public restoreFile(fileId: Guid, directoryId?: Guid) {
    const params: any = {
      restore: true,
    };
    if (!!directoryId) {
      params.newParentDirectoryId = directoryId.toString();
    }

    return super.update(null, `move/${fileId.toString()}`, params);
  }

  public deleteFile(fileId: Guid, permanentDelete?: boolean) {
    return super.remove(
      fileId,
      null,
      !!permanentDelete ? { permanent: permanentDelete } : {}
    );
  }
}
