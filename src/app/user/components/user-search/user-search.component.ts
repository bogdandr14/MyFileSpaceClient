import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { tap } from 'rxjs';
import { first, take } from 'rxjs';
import { InfiniteScrollFilter } from 'src/app/shared/models/infinite-scroll.filter';
import { FoundUsersModel } from '../../models/found-users.model';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll: IonInfiniteScroll;
  @Output() userClicked = new EventEmitter<UserModel>();
  @Input() isModal = false;
  @Input() extraIcon : any = null;

  public usersFound = new FoundUsersModel();
  public users: UserModel[];
  private filter: InfiniteScrollFilter;
  constructor(private userService: UserService) {}

  ngOnInit() {}

  get isMobile() {
    return window.innerWidth < 768; // Adjust the breakpoint as needed
  }
  findUsers($event) {
    if(!$event.detail.value){
      this.usersFound = new FoundUsersModel();
      this.users = [];
      return;
    }

    this.filter = { skip: 0, take: 15, name: $event.detail.value };
    this.userService
      .findUsers(this.filter)
      .pipe(first())
      .subscribe((foundUsers) => {
        this.usersFound = foundUsers;
        this.users = foundUsers.items;
      });
  }

  loadMoreUsers() {
    this.filter.skip = this.usersFound.skipped;
    this.userService
      .findUsers(this.filter)
      .pipe(first())
      .subscribe((foundUsers) => {
        this.usersFound = foundUsers;
        this.users = this.users.concat(foundUsers.items);
        this.infiniteScroll.complete();
        this.infiniteScroll.disabled = foundUsers.areLast;
      });
  }
}
