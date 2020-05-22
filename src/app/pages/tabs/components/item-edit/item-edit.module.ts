import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemEditComponent } from './item-edit.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CameraModule } from 'src/app/modules/camera/camera.module';
import { UploadModule } from 'src/app/modules/upload/upload.module';

@NgModule({
  declarations: [ItemEditComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, CameraModule, UploadModule],
  exports: [ItemEditComponent],
  entryComponents: [ItemEditComponent]
})
export class ItemEditModule {}
