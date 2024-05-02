import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilePage } from './page/file.page';

const routes: Routes = [
  {
    path: '',
    component: FilePage,
    data: { title: '_pages.file' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilePageRoutingModule {}
