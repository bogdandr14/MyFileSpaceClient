import { LocaleService } from './../../../core/services/locale.service';
import { DatePipe, formatDate } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-date-select-template',
  templateUrl: './date-select-template.component.html',
  styleUrls: ['./date-select-template.component.scss'],
})
export class DateSelectTemplateComponent {
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

  public minDate: string;

  public selectedDate: string | Date;
  constructor(
    public localeService: LocaleService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set date to tomorrow
    this.minDate = tomorrow.toISOString();
  }

  setDate(date: string | string[] | Date) {
    this._date = new Date(date as string);
    this.selectedDate = this.datePipe.transform(
      this._date,
      'dd/MM/yyyy',
      this.localeService.currentLocale
    );
    this.dateChange.emit(this._date);
    // this.cdr.detectChanges();
  }
}
