import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';
import { AutoLoginGuard } from '../core/guards/auto-login.guard';
import { LoginPage } from './pages/login/login.page';
import { ProfilePage } from './pages/profile/profile.page';
import { RegisterPage } from './pages/register/register.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginPage,
    canLoad: [AutoLoginGuard],
    data: { title: '_pages.login' }
  },
  {
    path: 'register',
    component: RegisterPage,
    canLoad: [AutoLoginGuard],
    data: { title: '_pages.register' }
  },
  {
    path: 'profile',
    component: ProfilePage,
    canLoad: [AuthGuard],
    data: { title: '_pages.profile' }
  },
  {
    path: 'profile/:id',
    component: ProfilePage,
    data: { title: '_pages.profile' }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
