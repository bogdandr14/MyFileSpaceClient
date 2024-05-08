import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './page/settings.page';
import { AccessibilitySettingsComponent } from './components/accessibility-settings/accessibility-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [
    SettingsPage,
    AccessibilitySettingsComponent,
    ChangePasswordComponent,
  ],
  imports: [SharedModule, SettingsPageRoutingModule],
  exports: [ChangePasswordComponent],
})
export class SettingsModule {}
