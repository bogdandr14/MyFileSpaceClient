import { NgModule } from '@angular/core';

import { UserPageRoutingModule } from './user-routing.module';

import { SharedModule } from '../shared/shared.module';
import { EmailCheckDirective } from './directives/emailCheck.directive';
import { TagnameCheckDirective } from './directives/tagnameCheck.directive';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { ProfilePage } from './pages/profile/profile.page';

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage,
    RegisterPage,
    TagnameCheckDirective,
    EmailCheckDirective,
  ],
  imports: [SharedModule, UserPageRoutingModule],
  providers: [Clipboard],
})
export class UserPageModule {}