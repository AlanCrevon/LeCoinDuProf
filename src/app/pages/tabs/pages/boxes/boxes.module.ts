import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BoxesPage } from './boxes.page';
import { BoxEditModule } from '../../components/box-edit/box-edit.module';

const routes: Routes = [
  {
    path: '',
    component: BoxesPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), BoxEditModule],
  declarations: [BoxesPage]
})
export class BoxesPageModule {}
