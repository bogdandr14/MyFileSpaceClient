import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {

  @Input() directoryDetails: DirectoryDetailsModel;
  @Output() directoryChange = new EventEmitter();

  constructor(private menuCtrl:MenuController) { }
  ngOnInit() {
    console.log(this.directoryDetails);
  }
  openDetailsMenu(){
    this.menuCtrl.open('details-menu');
  }
}
