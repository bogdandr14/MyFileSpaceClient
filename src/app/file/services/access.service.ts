import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/services/base.service';
import { environment } from 'src/environments/environment';
import { FileModel } from '../models/file.model';
import { AccessObjectModel } from '../../core/models/access-object.model';
import { UserModel } from '../../user/models/user.model';
import { AccessKeyModel } from '../models/access-key.model';
import { UserAccessUpdateModel } from '../models/user-access-update.model';
import { AccessKeyAddModel } from '../models/access-key-add.model';

@Injectable({ providedIn: 'root' })
export class AccessService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'api/access', environment.baseApiUrl);
  }

  public getUserAccess(
    accessObject: AccessObjectModel
  ): Observable<UserModel[]> {
    return super.getMany<UserModel>(
      `user/${accessObject.objectType}/${accessObject.objectId}`
    );
  }

  public updateUserAccess(
    userAccessUpdate: UserAccessUpdateModel
  ): Observable<UserModel[]> {
    return super.update(userAccessUpdate, 'user');
  }

  public getAccessKey(
    accessObject: AccessObjectModel
  ): Observable<AccessKeyModel> {
    return super.getOneByPath<AccessKeyModel>(
      `key/${accessObject.objectType}/${accessObject.objectId}`
    );
  }

  public addAccessKey(accessKey: AccessKeyAddModel): Observable<AccessKeyModel> {
    return super.add(accessKey, 'key');
  }

  public deleteAccessKey(accessObject: AccessObjectModel) {
    const path = `${this.url}/key/${accessObject.objectType}/${accessObject.objectId}`;
    return this.httpClient.delete<any>(path);
  }
}
