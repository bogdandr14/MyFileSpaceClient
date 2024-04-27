import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/services/base.service';
import { environment } from 'src/environments/environment';
import { FileModel } from '../models/file.model';
import { FileDetailsModel } from '../models/file-details.model';
import { FileUpdateModel } from '../models/file-update.model';

@Injectable({ providedIn: 'root' })
export class FileService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'api/storedfile', environment.baseApiUrl);
  }

  public getAllFiles(): Observable<FileModel[]> {
    return super.getAll<FileModel>();
  }

  public getFileInfo(
    fileId: Guid,
    accessKey?: string
  ): Observable<FileDetailsModel> {
    return super.getOneById<FileDetailsModel>(fileId, null, {
      accessKey: accessKey,
    });
  }

  public uploadFile(directoryId: Guid, file: File): Observable<FileModel> {
    let path = `${this.url}/upload/${directoryId}`;
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<FileModel>(path, formData);
  }

  public updateUploadFile(fileId: Guid, file: File): Observable<FileModel> {
    let path = `${this.url}/upload/${fileId}`;
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
    return super.update('move', fileId.toString(), {
      directoryId: directoryId.toString(),
    });
  }

  public restoreDirectory(fileId: Guid, directoryId?: Guid) {
    const params: any = {
      restore: true,
    };
    if (!!directoryId) {
      params.newParentDirectoryId = directoryId.toString();
    }

    return super.update('move', fileId.toString(), params);
  }

  public deleteFile(fileId: Guid, permanentDelete?: boolean) {
    return super.remove(
      fileId,
      null,
      !!permanentDelete ? { permanent: permanentDelete } : {}
    );
  }
}
