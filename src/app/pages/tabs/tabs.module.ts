import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IsLoggedInGuard } from 'src/app/guards/is-logged-in.guard';
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
        canActivate: [IsLoggedInGuard],
        loadChildren: './pages/chats/chats.module#ChatsPageModule'
      },
      {
        path: 'boxes',
        canActivate: [IsLoggedInGuard],
        loadChildren: './pages/boxes/boxes.module#BoxesPageModule'
      },
      {
        path: 'me',
        canActivate: [IsLoggedInGuard],
        loadChildren: './pages/me/me.module#MePageModule'
      },
      {
        path: 'moderate',
        canActivate: [IsLoggedInGuard],
        loadChildren: './pages/moderate/moderate.module#ModeratePageModule'
      },
      {
        path: 'login',
        loadChildren: './pages/login/login.module#LoginPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TabsPage]
})
export class TabsPageModule {}
