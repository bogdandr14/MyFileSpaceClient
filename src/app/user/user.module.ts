import { NgModule } from '@angular/core';

import { UserPageRoutingModule } from './user-routing.module';

import { SharedModule } from '../shared/shared.module';
import { EmailCheckDirective } from './directives/emailCheck.directive';
import { TagnameCheckDirective } from './directives/tagnameCheck.directive';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { ProfilePage } from './pages/profile/profile.page';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { StorageUsageComponent } from './components/storage-usage/storage-usage.component';
import { SettingsModule } from '../settings/settings.module';
import { SendMailPage } from './pages/send-mail/send-mail.page';
import { ConfirmPage } from './pages/confirm/confirm.page';
import { ResetPasswordPage } from './pages/reset-password/reset-password.page';

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage,
    RegisterPage,
    TagnameCheckDirective,
    EmailCheckDirective,
    UserSearchComponent,
    UserEditComponent,
    StorageUsageComponent,
    SendMailPage,
    ConfirmPage,
    ResetPasswordPage,
  ],
  imports: [SharedModule, UserPageRoutingModule, SettingsModule],
  exports: [UserSearchComponent],
  providers: [Clipboard],
})
export class UserPageModule {}
