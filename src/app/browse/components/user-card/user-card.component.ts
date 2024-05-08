import { Component, Input, OnInit } from '@angular/core';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { UserModel } from 'src/app/user/models/user.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() user: UserModel;
  constructor(public uiHelper: UiHelperService) {}

  ngOnInit() {}
}
