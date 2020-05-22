import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemEditPage } from './item-edit.page';
import { RouterModule, Routes } from '@angular/router';
import { ItemEditModule } from '../../components/item-edit/item-edit.module';

const routes: Routes = [
  {
    path: '',
    component: ItemEditPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), ItemEditModule],
  declarations: [ItemEditPage]
})
export class ItemEditPageModule {}
