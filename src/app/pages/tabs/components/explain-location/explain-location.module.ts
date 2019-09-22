import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplainLocationComponent } from './explain-location.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ExplainLocationComponent],
  imports: [CommonModule, IonicModule],
  exports: [ExplainLocationComponent],
  entryComponents: [ExplainLocationComponent]
})
export class ExplainLocationModule {}
