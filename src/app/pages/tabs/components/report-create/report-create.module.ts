import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReportCreateComponent } from './report-create.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReportCreateComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  entryComponents: [ReportCreateComponent]
})
export class ReportCreateModule {}
