import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-template',
  templateUrl: './input-template.component.html',
  styleUrls: ['./input-template.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTemplateComponent),
      multi: true
    }
  ]
})
export class InputTemplateComponent  {
  @Input() name: string;
  @Input() isRequired: boolean = false;
  @Input() minLength: number = 0;
  @Input() type: string = 'text';

  @Output() fieldChange = new EventEmitter();
  @Input() set field(val: any) {
    this.fieldChange.emit(val);
    this._field = val;
  }
  get field() {
    return this._field;
  }
  private _field: boolean;
  constructor() { }

}
