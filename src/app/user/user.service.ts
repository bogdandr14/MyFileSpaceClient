import { MailRequestModel } from './models/mail-request.model';
import { UserEditModel } from './models/user-edit.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUserModel } from '../core/models/auth/auth-user.model';
import { BaseService } from '../core/services/base.service';
import { DataService } from '../core/services/data.service';
import { InfiniteScrollFilter } from '../shared/models/infinite-scroll.filter';
import { FoundUsersModel } from './models/found-users.model';
import { CurrentUserModel } from './models/current-user.model';
import { UserDetailsModel } from './models/user-details.model';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  private userState = new BehaviorSubject<AuthUserModel>(null);

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
    return this.userState.value && userId === this.userState.value.userId;
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
      `availability/tagname/${tagName}`,
      null,
      BaseService.noLoadingConfig
    );
  }

  public checkEmailTaken(email: string): Observable<boolean> {
    return super.getOneByPath<boolean>(
      `availability/email/${email}`,
      null,
      BaseService.noLoadingConfig
    );
  }

  public findUsers(filter: InfiniteScrollFilter) {
    return super.getOneByPath<FoundUsersModel>(
      `search/${this.turnFilterIntoUrl(filter)}`
    );
  }

  public getPersonalInfo(
    internalRefresh: boolean = false
  ): Observable<CurrentUserModel> {
    return super.getOneByPath<CurrentUserModel>(
      '',
      null,
      internalRefresh ? BaseService.noLoadingConfig : null
    );
  }

  public getUser(
    userId: Guid | string,
    internalRefresh: boolean = false
  ): Observable<UserDetailsModel> {
    return super.getOneById<UserDetailsModel>(
      userId,
      null,
      null,
      internalRefresh ? BaseService.noLoadingConfig : null
    );
  }

  public updateUser(userEdit: UserEditModel) {
    return super.update<UserEditModel>(userEdit);
  }

  public sendMail(mailRequest: MailRequestModel) {
    return super.add(mailRequest, 'sendMail');
  }
}
