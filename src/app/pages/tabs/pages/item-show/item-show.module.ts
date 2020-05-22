import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemShowPageRoutingModule } from './item-show-routing.module';
import { ItemShowPage } from './item-show.page';
import { AgmCoreModule } from '@agm/core';
import { AdsenseModule } from 'ng2-adsense';
import { ReportCreateModule } from '../../components/report-create/report-create.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemShowPageRoutingModule,
    AgmCoreModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7640562161899788',
      adSlot: 7259870550
    }),
    ReportCreateModule
  ],
  declarations: [ItemShowPage]
})
export class ItemShowPageModule {}
