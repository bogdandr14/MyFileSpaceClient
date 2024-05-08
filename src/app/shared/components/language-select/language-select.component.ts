import { Component,  OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { environment } from 'src/environments/environment';
import { LanguageModel } from '../../../core/models/language.model';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
})
export class LanguageSelectComponent implements OnInit {

  public selectedLaguage: FormControl;
  public languageOptions: LanguageModel[];

  constructor(
    private dataService: DataService
  ) {
    this.selectedLaguage = new FormControl();
    this.languageOptions = environment.appSettings.languages;
  }

  ngOnInit(): void {
    this.dataService.language$.subscribe((language) => {
      if (this.selectedLaguage.value != language) {
        this.selectedLaguage.setValue(language);
      }
    });
  }
  onLanguageChange(language: string) {
    this.dataService.setLanguage(language);
  }
}
