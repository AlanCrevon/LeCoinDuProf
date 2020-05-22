import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BoxPage } from './box.page';
import { BoxEditModule } from '../../components/box-edit/box-edit.module';
import { ItemEditModule } from '../../components/item-edit/item-edit.module';

const routes: Routes = [
  {
    path: '',
    component: BoxPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), BoxEditModule, ItemEditModule],
  declarations: [BoxPage]
})
export class BoxPageModule {}
