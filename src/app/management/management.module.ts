import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagementPageRoutingModule } from './management-routing.module';

import { ManagementPage } from './page/management.page';
import { ConsumptionChartsComponent } from './components/consumption-charts/consumption-charts.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ManagementPageRoutingModule,
  ],
  declarations: [ManagementPage, ConsumptionChartsComponent],
})
export class ManagementPageModule {}
