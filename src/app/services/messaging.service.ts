import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { ToastService } from './toast.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { mergeMapTo, mergeMap } from 'rxjs/operators';
import { DbService } from './db.service';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';
import { FcmToken } from '../types/fcm-token';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private toastService: ToastService,
    private deviceService: DeviceDetectorService,
    private dbService: DbService,
    private authService: AuthService,
    private storage: Storage
  ) {
    this.angularFireMessaging.messaging.subscribe(messaging => {
      messaging.onMessage = messaging.onMessage.bind(messaging);
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });

    this.storage.get('notifications.enabled').then(enabled => {
      if (enabled === true) {
        this.updateToken();
      }
    });
  }

  /**
   * Let system ask the user if notifications can be displayed
   */
  requestPermission() {
    this.angularFireMessaging.requestPermission.pipe(mergeMapTo(this.angularFireMessaging.tokenChanges)).subscribe(
      token => {
        this.storage.set('notifications.enabled', true);
        this.storeToken(token);
      },
      error => {
        this.toastService.error(`💻 Votre navigateur n'autorise pas la gestion des notifications`);
      }
    );
  }

  /**
   * If permission has already been granted, update stored token
   * each time it is refreshed
   */
  async updateToken() {
    this.angularFireMessaging.requestToken.pipe(mergeMapTo(this.angularFireMessaging.tokenChanges)).subscribe(
      token => {
        this.storeToken(token);
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * Announce each new message in the service
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(payload => {
      this.currentMessage.next(payload);
    });
  }

  /**
   * Store FCM token in user's private settings
   * @param token FCM token
   */
  storeToken(token: string) {
    const fcm: FcmToken = {
      token,
      os: this.deviceService.os,
      browser: this.deviceService.browser,
      device: this.deviceService.device,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    const id = this.deviceService.os + this.deviceService.browser + this.deviceService.device;
    this.authService.appUser$.subscribe(appUser => {
      this.dbService.setDocument(`/users/${appUser.id}/tokens/${id}`, fcm);
    });
  }

  deleteToken() {
    this.angularFireMessaging.getToken.pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token))).subscribe(
      token => {
        console.log('Token deleted!');
        this.storage.remove('notifications.enabled');
        const id = this.deviceService.os + this.deviceService.browser + this.deviceService.device;
        this.authService.appUser$.subscribe(appUser => {
          this.dbService.deleteDocument(`/users/${appUser.id}/tokens/${id}`);
        });
      },
      error => {
        this.toastService.error(`💻 Votre navigateur n'autorise pas la gestion des notifications`);
      }
    );
  }
}
