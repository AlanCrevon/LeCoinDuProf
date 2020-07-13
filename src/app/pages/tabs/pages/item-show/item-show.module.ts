import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemShowPageRoutingModule } from './item-show-routing.module';
import { ItemShowPage } from './item-show.page';
import { AgmCoreModule } from '@agm/core';
import { ReportCreateModule } from '../../components/report-create/report-create.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ItemShowPageRoutingModule, AgmCoreModule, ReportCreateModule],
  declarations: [ItemShowPage]
})
export class ItemShowPageModule {}
