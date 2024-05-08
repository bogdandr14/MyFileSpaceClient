import { Injectable, Injector } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private isLoading = false;
  private loadingComponent: HTMLIonLoadingElement;
  constructor(private loadingController: LoadingController, private injector: Injector) {
  }

  public async startLoading() {
    this.isLoading = true;
    this.loadingComponent = await this.loadingController.create({
      message: this.translateService.instant('_message.loading'),
      duration: 60000,
      translucent: true,
      cssClass: 'lds-dual-ring',
      mode: 'md',
      spinner: 'crescent'
    });
    if(this.isLoading){
      await this.loadingComponent.present();
    }
  }

  public async endLoading() {
    this.isLoading = false;
    if(this.loadingComponent){
      await this.loadingComponent.dismiss();
    }
  }
  get translateService(): TranslateService{
    return this.injector.get(TranslateService);
  }
}
