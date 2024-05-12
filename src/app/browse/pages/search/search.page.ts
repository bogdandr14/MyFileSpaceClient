import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll, IonSearchbar, MenuController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FileDetailsModel } from 'src/app/file/models/file-details.model';
import { FileModel } from 'src/app/file/models/file.model';
import { FileService } from 'src/app/file/services/file.service';
import { InfiniteScrollFilter } from 'src/app/shared/models/infinite-scroll.filter';
import { UserModel } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements AfterViewInit {
  @ViewChild('infiniteScroll') infiniteScroll: IonInfiniteScroll;
  @ViewChild('searchBar') searchBar: IonSearchbar;

  private filter: InfiniteScrollFilter;
  private searchText: string;
  private lastTaken: number;
  public searchFiles = true;

  public includeOwn: boolean = false;
  public files: FileModel[];
  public users: UserModel[];
  public fixedCardHeight: number;
  public fileDetailsObject: FileDetailsModel;

  constructor(
    private fileService: FileService,
    private userService: UserService,
    private menuCtrl: MenuController,
    public authService: AuthService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calculateFixedCardHeight();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateFixedCardHeight();
    }, 500);
  }

  calculateFixedCardHeight() {
    // Get the height of the fixed card
    const fixedCardElement = document.getElementById('fixed-search-card');
    if (fixedCardElement) {
      this.fixedCardHeight = fixedCardElement.offsetHeight;
    }
  }

  handleRefresh(event) {
    this.files = null;
    this.users = null;
    this.searchBar.value = null;
    this.searchText = null;
    event.target.complete();
  }

  toggleSearchType($event) {
    this.searchFiles = $event.detail.value == '1';
    if (!!this.searchText) {
      this.findFirst();
    }
  }

  toggleIncludeOwn($event) {
    this.includeOwn = $event.detail.checked;
    if (!!this.searchText) {
      this.findFirst();
    }
  }

  find($event) {
    this.searchText = $event.detail.value;
    if (!!this.searchText) {
      this.findFirst();
    } else {
      this.files = [];
      this.users = [];
    }
  }

  private findFirst() {
    this.resetFilter();
    if (this.searchFiles) {
      this.fileService
        .findFiles(this.filter)
        .pipe(take(1))
        .subscribe((response) => {
          this.files = response.items;
          this.lastTaken = response.taken;
        });
    } else {
      this.userService
        .findUsers(this.filter)
        .pipe(take(1))
        .subscribe((response) => {
          this.users = response.items;
          this.lastTaken = response.taken;
        });
    }
  }

  private resetFilter() {
    this.filter = {
      skip: 0,
      take: 15,
      name: this.searchText,
      includeOwn: this.includeOwn,
    };
  }

  loadMore() {
    this.filter.skip += this.lastTaken;
    if (this.searchFiles) {
      this.fileService
        .findFiles(this.filter)
        .pipe(take(1))
        .subscribe((response) => {
          this.files = this.files.concat(response.items);
          this.lastTaken = response.taken;
          this.infiniteScroll.complete();
          this.infiniteScroll.disabled = response.areLast;
        });
    } else {
      this.userService
        .findUsers(this.filter)
        .pipe(take(1))
        .subscribe((response) => {
          this.users = this.users.concat(response.items);
          this.lastTaken = response.taken;
          this.infiniteScroll.complete();
          this.infiniteScroll.disabled = response.areLast;
        });
    }
  }

  openFileDetailsMenu(fileId: Guid) {
    this.fileService
      .getFileInfo(fileId)
      .pipe(take(1))
      .subscribe((response) => {
        this.fileDetailsObject = response;
        this.menuCtrl.open('file-details-menu');
      });
  }
}
