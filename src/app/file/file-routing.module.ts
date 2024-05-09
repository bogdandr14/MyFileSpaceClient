import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinPage } from './pages/bin/bin.page';

import { MyFilesPage } from './pages/my-files/my-files.page';
import { SharedFilesPage } from './pages/shared-files/shared-files.page';
import { FavoritePage } from './pages/favorite/favorite.page';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'shared',
    component: SharedFilesPage,
    canLoad: [AuthGuard],
    data: { title: '_pages.sharedFiles' },
  },
  {
    path: 'bin',
    component: BinPage,
    canLoad: [AuthGuard],
    data: { title: '_pages.bin' },
  },
  {
    path: 'favorite',
    component: FavoritePage,
    canLoad: [AuthGuard],
    data: { title: '_pages.favorites' },
  },
  {
    path: 'mine',
    component: MyFilesPage,
    canLoad: [AuthGuard],
    data: { title: '_pages.myFiles' },
  },
  {
    path: 'mine/:id',
    component: MyFilesPage,
    canLoad: [AuthGuard],
    data: { title: '_pages.myFiles' },
  },
  {
    path: '',
    component: MyFilesPage,
    canLoad: [AuthGuard],
    data: { title: '_pages.myFiles' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilePageRoutingModule {}
