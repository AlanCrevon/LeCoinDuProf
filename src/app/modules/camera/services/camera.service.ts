import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform, ActionSheetController, ModalController } from '@ionic/angular';
import { WebcamComponent } from '../components/webcam/webcam.component';
import { Subject, Observable } from 'rxjs';
import { FilebrowserComponent } from '../components/filebrowser/filebrowser.component';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  isCordova = false;

  private image: Subject<any> = new Subject();

  constructor(
    private camera: Camera,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {
    this.detectCordova();
  }

  detectCordova() {
    this.platform.ready().then(platform => {
      if (this.platform.is('cordova')) {
        this.isCordova = true;
      }
    });
  }

  async getPicture(options?: CameraOptions): Promise<string> {
    const defaultOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true,
      targetWidth: 500,
      targetHeight: 500
    };
    const opt = { ...defaultOptions, ...options };
    const imageData = await this.camera.getPicture(opt);
    if (opt.destinationType === this.camera.DestinationType.DATA_URL) {
      return 'data:image/jpeg;base64,' + imageData;
    } else {
      return imageData;
    }
  }

  selectImage(options?: any): Observable<any> {
    const defaultOptions = {
      headerTextLabel: `Sélectionnez la source de l'image`,
      fromFileTextLabel: 'Depuis un fichier',
      fromCameraTextLabel: 'Depuis la caméra',
      deleteImage: `Effacer l'image`,
      cancelTextLabel: 'Annuler'
    };
    const opt = { ...defaultOptions, ...options };
    const open = async () => {
      const actionSheet = await this.actionSheetController.create({
        header: opt.headerTextLabel,
        buttons: [
          {
            text: opt.fromFileTextLabel,
            handler: () => {
              if (this.isCordova) {
                this.getPicture({
                  sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
                }).then(picture => this.image.next(picture));
              } else {
                this.modalController
                  .create({
                    component: FilebrowserComponent
                  })
                  .then(modal => {
                    modal.present();
                    modal.onDidDismiss().then(result => {
                      if (!!result.data) {
                        this.image.next(result.data);
                      }
                    });
                  });
              }
            }
          },
          {
            text: opt.fromCameraTextLabel,
            handler: () => {
              if (this.isCordova) {
                this.getPicture().then(picture => {
                  this.image.next(picture);
                });
              } else {
                this.modalController
                  .create({
                    component: WebcamComponent
                  })
                  .then(modal => {
                    modal.present();
                    modal.onDidDismiss().then(result => {
                      if (!!result.data) {
                        this.image.next(result.data);
                      }
                    });
                  });
              }
            }
          },
          {
            text: opt.deleteImage,
            handler: () => {
              this.image.next(undefined);
            }
          },
          {
            text: opt.cancelTextLabel,
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    };
    open();
    return this.image.asObservable();
  }
}
