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

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage,
    RegisterPage,
    TagnameCheckDirective,
    EmailCheckDirective,
    UserSearchComponent,
    UserEditComponent,
    StorageUsageComponent
  ],
  imports: [SharedModule, UserPageRoutingModule, SettingsModule],
  exports:[UserSearchComponent],
  providers: [Clipboard],
})
export class UserPageModule {}
