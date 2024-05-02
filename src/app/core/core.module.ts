import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NavigationLinkComponent } from './components/navigation-link/navigation-link.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppHttpInterceptor } from './interceptors/http.interceptor';
import { LoadingInterceptor } from './interceptors/loading-interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppErrorHandler } from './app-error-handler';
import { LocaleProvider } from './locale.provider';
import { IonicModule } from '@ionic/angular';
import { ClipboardModule } from 'ngx-clipboard';

// AoT requires an exported function for factories
export function createTranslateLoader(httpClient: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [NavigationLinkComponent],
  imports: [
    BrowserModule,
    IonicModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
      defaultLanguage: environment.defaultLanguage,
      useDefaultLang: true,
    }),
    RouterModule,
    CommonModule,
    ClipboardModule
  ],
  exports: [
    TranslateModule,
    ReactiveFormsModule,
    NavigationLinkComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    DatePipe,
    Clipboard,
    LocaleProvider
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
