import { LocaleService } from './../../../core/services/locale.service';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-select-template',
  templateUrl: './date-select-template.component.html',
  styleUrls: ['./date-select-template.component.scss'],
})
export class DateSelectTemplateComponent  {
  @Input() name: string;
  @Input() isRequired: boolean;
  @Input() id: number = 0;
  @Input() set date(date: Date) {
    if (date) {
      this.setDate(date);
    }
  }
  @Output() dateChange = new EventEmitter<Date>();

  private _date: Date;
  get date() {
    return this._date;
  }
  public selectedDate: string | Date;
  constructor(public localeService: LocaleService, private cdr: ChangeDetectorRef) { }

  setDate(date: string | string[] | Date) {
    this._date = new Date(date[0]);
    this.selectedDate = formatDate(date[0], 'dd/MM/yyyy', this.localeService.currentLocale);
    this.dateChange.emit(this._date);
    this.cdr.detectChanges();
  }
}
