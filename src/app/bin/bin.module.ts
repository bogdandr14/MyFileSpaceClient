import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BinPageRoutingModule } from './bin-routing.module';

import { BinPage } from './page/bin.page';
import { SharedModule } from '../shared/shared.module';
import { FilePageModule } from '../file/file.module';

@NgModule({
  imports: [SharedModule, BinPageRoutingModule,FilePageModule],
  declarations: [BinPage],
})
export class BinPageModule {}
