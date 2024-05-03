import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { DataService } from 'src/app/core/services/data.service';
import { DirectoryService } from './directory.service';
import { FileService } from './file.service';

@Injectable({ providedIn: 'root' })
export class FileSystemHelperService {
  constructor(
    private alertService: AlertService,
    private translateService: TranslateService,
    private fileService: FileService,
    private directoryService: DirectoryService,
    private dataService: DataService
  ) {}
}
