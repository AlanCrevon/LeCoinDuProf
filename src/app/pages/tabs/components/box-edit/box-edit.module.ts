import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxEditComponent } from './box-edit.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { ExplainLocationModule } from '../explain-location/explain-location.module';

@NgModule({
  declarations: [BoxEditComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, AgmCoreModule, ExplainLocationModule],
  exports: [BoxEditComponent],
  entryComponents: [BoxEditComponent]
})
export class BoxEditModule {}
