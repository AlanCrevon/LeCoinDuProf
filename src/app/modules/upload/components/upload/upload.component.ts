import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  file: Blob | File;
  path: string;
  fileName: string;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage, private modalController: ModalController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.uploadFile(this.path, this.file);
    console.log('ionViewDidEnter page');
  }

  uploadFile(filePath: string, file: Blob | File) {
    console.log(file);
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.modalController.dismiss();
        })
      )
      .subscribe();
  }
}
