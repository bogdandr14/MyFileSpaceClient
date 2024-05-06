import { NgModule } from '@angular/core';
import { BrowsePageRoutingModule } from './browse-routing.module';

import { FileCardComponent } from './components/file-card/file-card.component';
import { SharedModule } from '../shared/shared.module';
import { UserCardComponent } from './components/user-card/user-card.component';
import { FilePageModule } from '../file/file.module';
import { SearchPage } from './pages/search/search.page';
import { CollectionPage } from './pages/collection/collection.page';

@NgModule({
  imports: [SharedModule, BrowsePageRoutingModule, FilePageModule],
  declarations: [
    FileCardComponent,
    UserCardComponent,
    SearchPage,
    CollectionPage,
  ],
  providers: [Clipboard],
})
export class BrowsePageModule {}
