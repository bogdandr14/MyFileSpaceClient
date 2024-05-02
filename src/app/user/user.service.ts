import { UserEditModel } from './models/user-edit.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CurrentUserModel } from '../core/models/auth/current-user.model';
import { BaseService } from '../core/services/base.service';
import { DataService } from '../core/services/data.service';
import { InfiniteScrollFilter } from '../shared/models/infinite-scroll.filter';
import { FoundUsersModel } from './models/found-users.model';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  private userState = new BehaviorSubject<CurrentUserModel>(null);

  constructor(httpClient: HttpClient, private dataService: DataService) {
    super(httpClient, 'api/user', environment.baseApiUrl);
    this.initUserSubscriber();
  }

  private initUserSubscriber() {
    this.dataService.user$.subscribe((user) => {
      this.userState.next(user);
    });
  }

  public isCurrentUser(userId: Guid) {
    return userId === this.userState.value.userId;
  }

  public getUserId() {
    return this.userState.value.userId;
  }

  public getUserEmail() {
    return this.userState.value.email;
  }

  public getUserTagName() {
    return this.userState.value.tagName;
  }

  public checkTagnameTaken(tagName: string): Observable<boolean> {
    return super.getOneByPath<boolean>(
      `isAvailable/tagname/${tagName}`, null, BaseService.noLoadingConfig
    );
  }

  public checkEmailTaken(email: string): Observable<boolean> {
    return super.getOneByPath<boolean>(
      `isAvailable/email/${email}`, null, BaseService.noLoadingConfig
    );
  }

  public findUsers(filter: InfiniteScrollFilter) {
    return super.getOneByPath<FoundUsersModel>(`search/${this.turnFilterIntoUrl(filter)}`);
  }

  public getPersonalInfo(): Observable<CurrentUserModel> {
    return this.dataService.getCurrentUser();
  }

  public getUser<UserModel>(userId: Guid | string): Observable<UserModel> {
    return super.getOneById<UserModel>(userId);
  }

  public getUserByTagname<UserModel>(tagname: string): Observable<UserModel> {
    return super.getOneByPath<UserModel>(`tagname/${tagname}`);
  }

  public updateUser(userEdit: UserEditModel) {
    return  super.update<UserEditModel>(userEdit);
  }
}
