import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../core/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../core/services/locale.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { combineLatest } from 'rxjs';
import { RouteDescriptor } from '../core/models/route-descriptor';

export const DEFAULT_TITLE = 'MyFileSpace';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {


  public labels; // = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  fontSize = 'font-size-5';

  public connectedUserLinks: Array<RouteDescriptor> = [
    { title: '_pages.profile', path: '/user/profile', icon: 'person' },
    { title: '_pages.myFiles', path: '/file/mine', icon: 'folder' },
    { title: '_pages.sharedFiles', path: '/file/shared', icon: 'share' },
    { title: '_pages.bin', path: '/file/bin', icon: 'trash' },
  ];

  public freeUserLinks: Array<RouteDescriptor> = [
    { title: '_pages.login', path: '/user/login', icon: 'log-in' },
    { title: '_pages.register', path: '/user/register', icon: 'person-add' },
  ];

  public otherLinks: Array<RouteDescriptor> = [
    { title: '_pages.browse', path: '/browse', icon: 'search' },
    { title: '_pages.settings', path: '/settings', icon: 'settings' },
  ];

  constructor(
    public authService: AuthService,
    public dataService: DataService,
    private translateService: TranslateService,
    private localeService: LocaleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    const routeObs = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        if (child) {
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
        }
        return DEFAULT_TITLE;
      })
    );
    combineLatest([routeObs, this.translateService.onLangChange])
      .pipe(
        tap(([title, langChange]) => {
          if (langChange.lang != null) {
            this.setDocTitle(title);
          }
        })
      )
      .subscribe();
  }

  setDocTitle(title: string) {
    this.titleService.setTitle(this.translateService.instant(title));
  }

  private loadData() {
    this.translateService.use(environment.defaultLanguage);
    this.localeService.initLocale();
    this.dataService.language$.subscribe((language) => {
      this.translateService.use(language);
    });
  }
}
