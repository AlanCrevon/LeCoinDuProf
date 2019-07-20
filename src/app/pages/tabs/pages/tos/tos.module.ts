import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TosModule } from '../../components/tos/tos.module';
import { TosPage } from './tos.page';

const routes: Routes = [
  {
    path: '',
    component: TosPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), TosModule],
  declarations: [TosPage]
})
export class TosPageModule {}
