import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { WebcamComponent } from './components/webcam/webcam.component';
import { CameraService } from './services/camera.service';
import { FilebrowserComponent } from './components/filebrowser/filebrowser.component';

@NgModule({
  declarations: [WebcamComponent, FilebrowserComponent],
  imports: [CommonModule, IonicModule],
  providers: [Camera, CameraService],
  exports: [WebcamComponent],
  entryComponents: [WebcamComponent, FilebrowserComponent]
})
export class CameraModule {}
