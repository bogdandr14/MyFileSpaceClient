import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionPage } from './pages/collection/collection.page';

import { SearchPage } from './pages/search/search.page';

const routes: Routes = [
  {
    path: '',
    component: SearchPage,
  },
  {
    path: 'collection/:id',
    component: CollectionPage,
    data: { title: '_pages.collection' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowsePageRoutingModule {}
