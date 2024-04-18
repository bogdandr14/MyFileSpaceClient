import { filter, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CurrentUserModel } from '../models/auth/current-user.model';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { DARK_THEME_KEY, GRAYSCALE_KEY, HIGHLIGHT_KEY, INVERT_COLOR_KEY, LANG_KEY, TOKEN_KEY, USER_KEY } from '../models/data-keys.constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private user = new BehaviorSubject<CurrentUserModel>(new CurrentUserModel());
  public user$ = this.user.asObservable();

  private darkTheme = new BehaviorSubject<boolean>(null);
  public darkTheme$ = this.darkTheme.asObservable().pipe(filter((value) => value != null));

  private invertColor = new BehaviorSubject<boolean>(null);
  public invertColor$ = this.invertColor.asObservable().pipe(filter((value) => value != null));

  private grayscale = new BehaviorSubject<boolean>(null);
  public grayscale$ = this.grayscale.asObservable().pipe(filter((value) => value != null));

  private linkHighlight = new BehaviorSubject<boolean>(null);
  public linkHighlight$ = this.linkHighlight.asObservable().pipe(filter((value) => value != null));

  private fontSize = new BehaviorSubject<string>('font-size-5');
  public fontSize$ = this.fontSize.asObservable();

  private language = new BehaviorSubject<string>(environment.defaultLanguage);
  public language$ = this.language.asObservable().pipe(filter((value) => value != null));

  private storageReady = new BehaviorSubject(false);
  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady.next(true);
    this.initData();
  }

  initData() {
    forkJoin([
      this.getCurrentUser(),
      this.get<boolean>(DARK_THEME_KEY),
      this.get<boolean>(INVERT_COLOR_KEY),
      this.get<boolean>(GRAYSCALE_KEY),
      this.get<boolean>(HIGHLIGHT_KEY),
      this.getLanguage()
    ]).subscribe(
      ([user, dark, invert, gray, highlight, lang]) => {
        this.user.next(user);
        this.darkTheme.next(dark);
        this.invertColor.next(invert);
        this.grayscale.next(gray);
        this.linkHighlight.next(highlight);
        this.language.next(lang);
      }
    )
  }

  set(key: string, value: any) {
    this.storage.set(key, JSON.stringify(value));
  }

  get<T>(key: string): Observable<T | null> {
    return this.storageReady.pipe(
      filter((ready) => ready),
      switchMap(() => {
        return (
          from(this.storage.get(key).then((value) => <T>JSON.parse(value))) ||
          of(null)
        );
      }),
      take(1)
    );
  }

  remove(key: string) {
    this.storage.remove(key);
  }

  setInvert(invert: boolean) {
    this.set(INVERT_COLOR_KEY, invert);
    this.invertColor.next(invert);
  }

  setGrayscale(grayscale: boolean) {
    this.set(GRAYSCALE_KEY, grayscale);
    this.grayscale.next(grayscale);
  }

  setLinkHighlight(highlight: boolean) {
    this.set(HIGHLIGHT_KEY, highlight);
    this.linkHighlight.next(highlight);
  }

  setFontSize(fontSize: string) {
    this.fontSize.next(fontSize);
  }

  setTheme(theme: boolean) {
    this.set(DARK_THEME_KEY, theme);
    this.darkTheme.next(theme);
  }

  setLanguage(language: string) {
    this.set(LANG_KEY, language);
    this.language.next(language);
  }

  getLanguage(): Observable<string | null> {
    const lang = this.get<string>(LANG_KEY);
    return lang;
  }

  setToken(token: string | null) {
    this.set(TOKEN_KEY, token);
  }

  getToken(): Observable<string | null> {
    const jwt = this.get<string>(TOKEN_KEY);
    return jwt;
  }

  removeToken() {
    this.remove(TOKEN_KEY);
  }

  setCurrentUser(user: CurrentUserModel) {
    this.set(USER_KEY, user);
    this.user.next(user);
  }

  getCurrentUser(): Observable<CurrentUserModel | null> {
    const user = this.get<CurrentUserModel>(USER_KEY);
    return user;
  }

  removeCurrentUser() {
    this.remove(USER_KEY);
    this.user.next(null);
  }
}
