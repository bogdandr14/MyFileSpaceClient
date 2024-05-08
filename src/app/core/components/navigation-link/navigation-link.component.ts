import { Component, Input } from '@angular/core';
import { RouteDescriptor } from '../../models/route-descriptor';

@Component({
  selector: 'app-navigation-link',
  templateUrl: './navigation-link.component.html',
  styleUrls: ['./navigation-link.component.scss'],
})
export class NavigationLinkComponent  {
  @Input() link: RouteDescriptor;

  constructor() { }
}
