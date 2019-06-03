import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

/**
 * Service to display toast messages
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  defaultDuration = 3000;
  defaultSuccessColor = 'success';
  defaultErrorColor = 'danger';

  constructor(private toastController: ToastController) {}

  /**
   * Display a toat message
   * @param options toast display options
   */
  displayToast(options: ToastOptions) {
    this.toastController.create(options).then(toast => toast.present());
  }

  /**
   * Display a success message during 3 seconds
   * @param message message to display
   */
  success(message: string) {
    this.displayToast({
      message,
      duration: this.defaultDuration,
      color: this.defaultSuccessColor
    });
  }

  /**
   * Display an error message during 3 seconds
   * @param message message to display
   */
  error(message: string) {
    this.displayToast({
      message,
      duration: this.defaultDuration,
      color: this.defaultErrorColor
    });
  }
}
