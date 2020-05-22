import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';
import { UploadComponent } from '../components/upload/upload.component';
import { OverlayEventDetail } from '@ionic/core';
import { Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {
  constructor(private storage: AngularFireStorage, private modalController: ModalController) {}

  async upload(path: string, file: Blob | File, fileName?: string): Promise<OverlayEventDetail<any>> {
    const modal = await this.modalController.create({
      component: UploadComponent,
      backdropDismiss: false,
      componentProps: {
        path,
        file,
        fileName
      }
    });
    modal.present();
    return modal.onDidDismiss();
  }

  async uploadImage(path: string, image: string, fileName?: string): Promise<OverlayEventDetail<any>> {
    const b64Data = image.split(',')[1];
    const contentType = image
      .split(',')[0]
      .replace('data:', '')
      .replace(';base64', '');
    const blob = this.b64toBlob(b64Data, contentType);
    return this.upload(path, blob, fileName);
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  download(path: string): Observable<string | null> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      first(),
      catchError(error => {
        return of(null);
      })
    );
  }

  delete(path: string): Observable<any> {
    const ref = this.storage.ref(path);
    return ref.delete();
  }
}
