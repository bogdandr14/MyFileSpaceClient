import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinPage } from './pages/bin/bin.page';

import { MyFilesPage } from './pages/my-files/my-files.page';
import { SharedFilesPage } from './pages/shared-files/shared-files.page';

const routes: Routes = [

  {
    path: 'shared',
    component: SharedFilesPage,
    data: { title: '_pages.sharedFiles' }
  },
  {
    path: 'bin',
    component: BinPage,
    data: { title: '_pages.bin' }
  },
  {
    path: 'mine',
    component: MyFilesPage,
    data: { title: '_pages.myFiles' }
  },
  {
    path: 'mine/:id',
    component: MyFilesPage,
    data: { title: '_pages.myFiles' }
  },
  {
    path: '',
    component: MyFilesPage,
    data: { title: '_pages.myFiles' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilePageRoutingModule {}
