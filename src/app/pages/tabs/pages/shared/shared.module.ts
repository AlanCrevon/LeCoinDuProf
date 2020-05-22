import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedPage } from './shared.page';
import { ItemSearchModule } from '../../components/item-search/item-search.module';

const routes: Routes = [
  {
    path: '',
    component: SharedPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), ItemSearchModule],
  declarations: [SharedPage]
})
export class SharedPageModule {}
