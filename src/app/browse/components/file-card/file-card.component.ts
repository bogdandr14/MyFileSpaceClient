import { Component, Input, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/core/services/locale.service';
import { UiHelperService } from 'src/app/core/services/ui-helper.service';
import { FileModel } from 'src/app/file/models/file.model';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss'],
})
export class FileCardComponent implements OnInit {
  @Input() file: FileModel;
  constructor(
    public uiHelper: UiHelperService,
    public localeService: LocaleService
  ) {}

  ngOnInit() {}
}
