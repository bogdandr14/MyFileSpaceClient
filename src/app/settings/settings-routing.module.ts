import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

import { SettingsPage } from './page/settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    canLoad: [AuthGuard],
    data: { title: '_pages.settings' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
