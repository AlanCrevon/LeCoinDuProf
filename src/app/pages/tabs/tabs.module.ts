import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HasVerifiedEmailGuard } from 'src/app/guards/has-verified-email.guard';
import { IsLoggedInGuard } from 'src/app/guards/is-logged-in.guard';
import { TabsPage } from './tabs.page';
import { HasInitializedAccountGuard } from 'src/app/guards/has-initialized-account.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'shared',
        loadChildren: () => import('./pages/shared/shared.module').then(m => m.SharedPageModule)
      },
      {
        path: 'shared/:itemId',
        pathMatch: 'full',
        loadChildren: () => import('./pages/item-show/item-show.module').then(m => m.ItemShowPageModule)
      },
      {
        path: 'wanted',
        loadChildren: () => import('./pages/wanted/wanted.module').then(m => m.WantedPageModule)
      },
      {
        path: 'chats',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/chats/chats.module').then(m => m.ChatsPageModule)
      },
      {
        path: 'chats/:chatId',
        pathMatch: 'full',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'boxes',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/boxes/boxes.module').then(m => m.BoxesPageModule)
      },
      {
        path: 'boxes/:boxId',
        pathMatch: 'full',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/box/box.module').then(m => m.BoxPageModule)
      },
      {
        path: 'boxes/:boxId/:itemId',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/item-edit/item-edit.module').then(m => m.ItemEditPageModule)
      },
      {
        path: 'me',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/me/me.module').then(m => m.MePageModule)
      },
      {
        path: 'moderate',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/moderate/moderate.module').then(m => m.ModeratePageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
      },
      {
        path: 'team',
        loadChildren: () => import('./pages/team/team.module').then(m => m.TeamPageModule)
      },
      {
        path: 'tos',
        loadChildren: () => import('./pages/tos/tos.module').then(m => m.TosPageModule)
      },
      {
        path: 'register-confirm',
        loadChildren: () =>
          import('./pages/register-confirm/register-confirm.module').then(m => m.RegisterConfirmPageModule)
      },
      {
        path: 'welcome',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard],
        loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TabsPage]
})
export class TabsPageModule {}
