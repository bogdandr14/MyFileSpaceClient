import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-accessibility-settings',
  templateUrl: './accessibility-settings.component.html',
  styleUrls: ['./accessibility-settings.component.scss'],
})
export class AccessibilitySettingsComponent implements OnInit {

  public darkCtrl: FormControl;
  public invertCtrl: FormControl;
  public grayCtrl: FormControl;
  public highlightCtrl: FormControl;
  public fontSizeCtrl: FormControl;

  constructor(private dataService: DataService) {
    this.darkCtrl = new FormControl();
    this.invertCtrl = new FormControl();
    this.grayCtrl = new FormControl();
    this.highlightCtrl = new FormControl();
    this.fontSizeCtrl = new FormControl();
  }

  ngOnInit() {
    this.dataService.darkTheme$.subscribe((value) => {
      if (this.darkCtrl.value != value) {
        this.darkCtrl.setValue(value);
      }
    });
    this.dataService.invertColor$.subscribe((value) => {
      if (this.invertCtrl.value != value) {
        this.invertCtrl.setValue(value);
      }
    });
    this.dataService.grayscale$.subscribe((value) => {
      if (this.grayCtrl.value != value) {
        this.grayCtrl.setValue(value);
      }
    });
    this.dataService.linkHighlight$.subscribe((value) => {
      if (this.highlightCtrl.value != value) {
        this.highlightCtrl.setValue(value);
      }
    });
  }

  toggleDarkTheme(darkTheme: boolean) {
    this.dataService.setTheme(darkTheme);
  }

  toggleInvertColor(invertColor: boolean) {
    this.dataService.setInvert(invertColor);
  }

  toggleGrayscale(grayscale: boolean) {
    this.dataService.setGrayscale(grayscale);
  }

  toggleLinkHighlight(highlight: boolean) {
    this.dataService.setLinkHighlight(highlight);
  }

  toggleFontSize(fontSize: any) {
    const size = fontSize.detail.value;
    this.dataService.setFontSize(`font-size-${size}`);
  }
}
