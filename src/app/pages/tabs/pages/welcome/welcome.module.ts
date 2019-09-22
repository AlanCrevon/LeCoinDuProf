import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WelcomePage } from './welcome.page';
import { CameraModule } from 'src/app/modules/camera/camera.module';
import { ExplainLocationModule } from '../../components/explain-location/explain-location.module';
import { AgmCoreModule } from '@agm/core';
import { UploadModule } from 'src/app/modules/upload/upload.module';

const routes: Routes = [
  {
    path: '',
    component: WelcomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CameraModule,
    ReactiveFormsModule,
    ExplainLocationModule,
    AgmCoreModule,
    UploadModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}
