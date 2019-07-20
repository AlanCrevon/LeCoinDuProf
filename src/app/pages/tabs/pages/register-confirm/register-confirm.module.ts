import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegisterConfirmPage } from './register-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterConfirmPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [RegisterConfirmPage]
})
export class RegisterConfirmPageModule {}
