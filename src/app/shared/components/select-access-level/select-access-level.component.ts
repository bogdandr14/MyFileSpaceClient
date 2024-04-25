import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { AccessLevel } from '../../models/access-level.enum';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-access-level',
  templateUrl: './select-access-level.component.html',
  styleUrls: ['./select-access-level.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAccessLevelComponent),
      multi: true,
    },
  ],
})
export class SelectAccessLevelComponent {
  @Input() name: string;
  @Input() isRequired: boolean = false;
  @Output() fieldChange = new EventEmitter();

  @Input() set field(val: AccessLevel) {
    this.fieldChange.emit(val);
    this._field = val;
  }
  get field() {
    return this._field;
  }
  private _field: AccessLevel;

  public accessLevelType = AccessLevel;
  constructor() {}
}
