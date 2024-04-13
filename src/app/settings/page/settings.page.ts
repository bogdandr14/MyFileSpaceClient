import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage  {
  public openModal = false;
  constructor(
    public authService: AuthService,
    public dataService: DataService
  ) {}

  onLogout() {
    this.authService.logout();
  }
}
