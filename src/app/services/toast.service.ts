import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';
import { Router } from '@angular/router';

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
  defaultNotifyColor = 'tertiary';
  defaultPosition: 'middle' | 'top' | 'bottom' = 'top';

  constructor(private toastController: ToastController, private router: Router) {}

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
      color: this.defaultSuccessColor,
      position: this.defaultPosition
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
      color: this.defaultErrorColor,
      position: this.defaultPosition
    });
  }

  /**
   * Notify a FCM message with a redirection button
   */
  async fcm(fcm: any) {
    const message = `<b>${fcm.notification.title}<br /></b>${fcm.notification.body}`;
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'secondary',
      position: 'top',
      buttons: [
        {
          text: 'Voir',
          side: 'end',
          handler: () => {
            switch (fcm.data.topic) {
              case 'chat':
                this.router.navigateByUrl(`/app/chats/${fcm.data.id}`);
                break;

              default:
                break;
            }
          }
        }
      ]
    });

    // Define if the toast should be displayed
    switch (fcm.data.topic) {
      case 'chat':
        // Display chat notification only if this chat is not
        // currently opened
        if (this.router.url !== `/app/chats/${fcm.data.id}`) {
          toast.present();
        }

        break;

      default:
        // Open all notifications by default;
        toast.present();
        break;
    }
  }
}
