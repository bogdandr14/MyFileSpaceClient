import { Component, Input, OnInit } from '@angular/core';
import { DirectoryDetailsModel } from '../../models/directory-details.model';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {

  @Input() directoryDetails: DirectoryDetailsModel;
  constructor() { }
  ngOnInit() {
    console.log(this.directoryDetails);
  }

}
