import { NgModule } from '@angular/core';
import { BrowsePageRoutingModule } from './browse-routing.module';

import { BrowsePage } from './page/browse.page';
import { FileCardComponent } from './components/file-card/file-card.component';
import { SharedModule } from '../shared/shared.module';
import { UserCardComponent } from './components/user-card/user-card.component';
import { FilePageModule } from '../file/file.module';

@NgModule({
  imports: [SharedModule, BrowsePageRoutingModule, FilePageModule],
  declarations: [BrowsePage, FileCardComponent, UserCardComponent],
  providers: [Clipboard],
})
export class BrowsePageModule {}
