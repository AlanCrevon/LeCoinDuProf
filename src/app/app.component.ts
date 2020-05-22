import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, MenuController } from '@ionic/angular';
import { NavigationService } from './services/navigation.service';
import { MessagingService } from './services/messaging.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navigationService: NavigationService,
    private menuController: MenuController,
    private messagingService: MessagingService,
    private toastService: ToastService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Disable menu swipe gesture
      this.menuController.swipeGesture(false);

      // Enable notifications
      this.messagingService.receiveMessage();
      this.messagingService.currentMessage.subscribe(message => {
        if (!!message) {
          this.toastService.fcm(message);
        }
      });
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  notifyMessage(message) {}
}
