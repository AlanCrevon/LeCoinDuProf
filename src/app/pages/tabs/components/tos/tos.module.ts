import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TosComponent } from './tos.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TosComponent],
  imports: [CommonModule, IonicModule],
  exports: [TosComponent]
})
export class TosModule {}
