import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { AgmCoreModule } from '@agm/core';
import { Camera } from '@ionic-native/camera/ngx';
import { AdsenseModule } from 'ng2-adsense';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule, // .enablePersistence(),
    AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey,
      libraries: ['places']
    }),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7640562161899788',
      adSlot: 7259870550
    }),
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    /*{
      provide: SETTINGS,
      useValue: environment.production
        ? undefined
        : {
            host: 'localhost:8080',
            ssl: false
          }
    },*/
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    Camera
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
