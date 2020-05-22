import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ItemSearchComponent } from './item-search.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ItemSearchComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [ItemSearchComponent],
  entryComponents: [ItemSearchComponent]
})
export class ItemSearchModule {}
