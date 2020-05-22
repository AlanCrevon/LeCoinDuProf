import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MePage } from './me.page';
import { CameraModule } from 'src/app/modules/camera/camera.module';
import { ExplainLocationModule } from '../../components/explain-location/explain-location.module';
import { UploadModule } from 'src/app/modules/upload/upload.module';

const routes: Routes = [
  {
    path: '',
    component: MePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CameraModule,
    ExplainLocationModule,
    UploadModule
  ],
  declarations: [MePage]
})
export class MePageModule {}
