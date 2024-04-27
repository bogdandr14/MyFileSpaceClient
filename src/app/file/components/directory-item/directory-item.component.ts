import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryModel } from '../../models/directory.model';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.scss'],
})
export class DirectoryItemComponent {
  @Input() directory: DirectoryModel;
  @Output() directoryChange = new EventEmitter();

  constructor(private menuCtrl: MenuController) {}
  openDetailsMenu() {
    this.menuCtrl.open('details-menu');
  }

}
