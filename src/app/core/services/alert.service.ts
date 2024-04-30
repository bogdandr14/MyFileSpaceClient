import { DataService } from 'src/app/core/services/data.service';
import { Injectable, Injector } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppError } from '../models/errors/app-error';
@Injectable({ providedIn: 'root' })
export class AlertService {
  private successSound = new Audio(
    '../../../assets/audio/mixkit-software-interface.wav'
  );
  private infoSound = new Audio(
    '../../../assets/audio/mixkit-game-balloon-or-bubble-pop.wav'
  );

  private warnSound = new Audio(
    '../../../assets/audio/mixkit-on-or-off-light-switch-tap.wav'
  );
  private errorSound = new Audio(
    '../../../assets/audio/mixkit-tech-break-fail.wav'
  );

  private useAudio = true;
  constructor(
    private injector: Injector,
    private toastController: ToastController,
    private alertController: AlertController,
    private dataService: DataService
  ) {
    this.setAudio();
    this.initAudioSubscriber();
  }

  setAudio() {
    this.successSound.load();
    this.infoSound.load();
    this.warnSound.load();
    this.errorSound.load();
  }

  initAudioSubscriber() {
    this.dataService.audio$.subscribe((audio) => {
      this.useAudio = audio;
    });
  }

  async presentAlert(
    header: string,
    message: string,
    cancelButtonName: string,
    confirmButtonName: string,
    context: object,
    confirmAction: () => {}
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancelButtonName,
          role: 'cancel',
        },
        {
          text: confirmButtonName,
          handler: confirmAction.bind(context),
        },
      ],
    });
    await alert.present();
    if (this.useAudio) {
      this.infoSound.play();
    }
  }

  public async showSuccess(success: any) {
    const toast = await this.createToast(
      '_message.success',
      success,
      'success',
      'checkmark-circle'
    );

    toast.present();
    if (this.useAudio) {
      this.successSound.play();
    }
  }

  public async showError(error: any) {
    let toast: HTMLIonToastElement;
    if (error instanceof AppError) {
      toast = await this.createToast(
        '_message.error',
        error.originalErr.error && error.originalErr.error.detail
          ? error.originalErr.error.detail
          : error.message,
        'danger',
        'close-circle',
        error.status
      );
    } else {
      toast = await this.createToast(
        '_message.error',
        error,
        'danger',
        'close-circle'
      );
    }
    toast.present();
    if (this.useAudio) {
      this.errorSound.play();
    }
  }

  public async showInfo(info: any) {
    const toast = await this.createToast(
      '_message.information',
      info,
      'primary',
      'information-circle'
    );
    toast.present();
    this.infoSound.play();
  }

  public async showWarning(warning: any) {
    const toast = await this.createToast(
      '_message.warning',
      warning,
      'warning',
      'alert-circle'
    );
    toast.present();
    if (this.useAudio) {
      this.warnSound.play();
    }
  }

  private async createToast(
    title: string,
    message: string,
    color: string,
    icon: string,
    status?: number
  ) {
    const toast = await this.toastController.create({
      header:
        this.translateService.instant(title) + ' ' + (status ? status : ''),
      message: this.translateService.instant(message),
      color: color,
      icon: icon,
      position: 'bottom',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            return true;
          },
        },
      ],
      duration: 4000,
    });
    return toast;
  }

  get translateService(): TranslateService {
    return this.injector.get(TranslateService);
  }
}
