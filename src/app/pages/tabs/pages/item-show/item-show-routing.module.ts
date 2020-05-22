import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemShowPage } from './item-show.page';

const routes: Routes = [
  {
    path: '',
    component: ItemShowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemShowPageRoutingModule {}
