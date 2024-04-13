import { CommonObject } from '../../models/common-object';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss'],
})
export class SelectTemplateComponent {
  @Input() name: string;
  @Input() options: CommonObject[] = [];
  @Input() optionsPrefix: string;

  @Output() fieldChange = new EventEmitter();
  @Input() set field(val: number) {
    this.fieldChange.emit(val);
    this._field = val;
  }
  get field() {
    return this._field;
  }
  private _field: number;
  constructor() { }
}
