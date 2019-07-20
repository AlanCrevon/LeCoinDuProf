import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TosModule } from 'src/app/pages/tabs/components/tos/tos.module';
import { ModalTosPage } from './modal-tos.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TosModule],
  declarations: [ModalTosPage],
  entryComponents: [ModalTosPage]
})
export class ModalTosPageModule {}
