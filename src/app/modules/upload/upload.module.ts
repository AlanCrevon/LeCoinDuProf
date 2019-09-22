import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestorageService } from './services/firestorage.service';
import { UploadComponent } from './components/upload/upload.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [UploadComponent],
  imports: [CommonModule, IonicModule],
  providers: [FirestorageService],
  entryComponents: [UploadComponent]
})
export class UploadModule {}
