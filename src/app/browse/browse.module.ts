import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowsePageRoutingModule } from './browse-routing.module';

import { BrowsePage } from './page/browse.page';
import { FileCardComponent } from './components/file-card/file-card.component';
import { SharedModule } from '../shared/shared.module';
import { UserCardComponent } from './components/user-card/user-card.component';

@NgModule({
  imports: [SharedModule, BrowsePageRoutingModule],
  declarations: [BrowsePage, FileCardComponent, UserCardComponent],
})
export class BrowsePageModule {}
