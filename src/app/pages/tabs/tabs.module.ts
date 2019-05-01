import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'shared',
        loadChildren: './pages/shared/shared.module#SharedPageModule'
      },
      {
        path: 'wanted',
        loadChildren: './pages/wanted/wanted.module#WantedPageModule'
      },
      {
        path: 'chats',
        loadChildren: './pages/tabs/pages/chats/chats.module#ChatsPageModule'
      },
      {
        path: 'boxes',
        loadChildren: './pages/tabs/pages/boxes/boxes.module#BoxesPageModule'
      },
      {
        path: 'me',
        loadChildren: './pages/tabs/pages/me/me.module#MePageModule'
      },
      {
        path: 'moderate',
        loadChildren: './pages/tabs/pages/moderate/moderate.module#ModeratePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TabsPage]
})
export class TabsPageModule {}
