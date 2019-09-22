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
        loadChildren: './pages/shared/shared.module#SharedPageModule'
      },
      {
        path: 'wanted',
        loadChildren: './pages/wanted/wanted.module#WantedPageModule'
      },
      {
        path: 'chats',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: './pages/chats/chats.module#ChatsPageModule'
      },
      {
        path: 'boxes',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: './pages/boxes/boxes.module#BoxesPageModule'
      },
      {
        path: 'box/:boxId',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: './pages/box/box.module#BoxPageModule'
      },
      {
        path: 'me',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: './pages/me/me.module#MePageModule'
      },
      {
        path: 'moderate',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: './pages/moderate/moderate.module#ModeratePageModule'
      },
      {
        path: 'login',
        loadChildren: './pages/login/login.module#LoginPageModule'
      },
      {
        path: 'register',
        loadChildren: './pages/register/register.module#RegisterPageModule'
      },
      {
        path: 'tos',
        loadChildren: './pages/tos/tos.module#TosPageModule'
      },
      {
        path: 'register-confirm',
        loadChildren: './pages/register-confirm/register-confirm.module#RegisterConfirmPageModule'
      },
      {
        path: 'welcome',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard],
        loadChildren: './pages/welcome/welcome.module#WelcomePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TabsPage]
})
export class TabsPageModule {}
