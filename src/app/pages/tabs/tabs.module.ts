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
        loadChildren: () => import('./pages/shared/shared.module').then(m => m.SharedPageModule),
        data: {
          title: {
            text: 'Partages'
          }
        }
      },
      {
        path: 'shared/:itemId',
        pathMatch: 'full',
        loadChildren: () => import('./pages/item-show/item-show.module').then(m => m.ItemShowPageModule),
        data: {
          title: {
            text: 'Partage'
          }
        }
      },
      {
        path: 'wanted',
        loadChildren: () => import('./pages/wanted/wanted.module').then(m => m.WantedPageModule),
        data: {
          title: {
            text: 'Recherches'
          }
        }
      },
      {
        path: 'chats',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/chats/chats.module').then(m => m.ChatsPageModule),
        data: {
          title: {
            text: 'Chats'
          }
        }
      },
      {
        path: 'chats/:chatId',
        pathMatch: 'full',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule),
        data: {
          title: {
            text: 'Chat'
          }
        }
      },
      {
        path: 'boxes',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/boxes/boxes.module').then(m => m.BoxesPageModule),
        data: {
          title: {
            text: 'Boites'
          }
        }
      },
      {
        path: 'boxes/:boxId',
        pathMatch: 'full',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/box/box.module').then(m => m.BoxPageModule),
        data: {
          title: {
            text: 'Boite'
          }
        }
      },
      {
        path: 'boxes/:boxId/:itemId',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/item-edit/item-edit.module').then(m => m.ItemEditPageModule),
        data: {
          title: {
            text: 'Objet'
          }
        }
      },
      {
        path: 'me',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/me/me.module').then(m => m.MePageModule),
        data: {
          title: {
            text: 'Moi'
          }
        }
      },
      {
        path: 'moderate',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard, HasInitializedAccountGuard],
        loadChildren: () => import('./pages/moderate/moderate.module').then(m => m.ModeratePageModule),
        data: {
          title: {
            text: 'Modération'
          }
        }
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
        data: {
          title: {
            text: `S'authentifier`
          }
        }
      },
      {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule),
        data: {
          title: {
            text: 'Créer un compte'
          }
        }
      },
      {
        path: 'team',
        loadChildren: () => import('./pages/team/team.module').then(m => m.TeamPageModule),
        data: {
          title: {
            text: `L'équipe`
          }
        }
      },
      {
        path: 'tos',
        loadChildren: () => import('./pages/tos/tos.module').then(m => m.TosPageModule),
        data: {
          title: {
            text: `Conditions générales d'utilisation`
          }
        }
      },
      {
        path: 'register-confirm',
        loadChildren: () =>
          import('./pages/register-confirm/register-confirm.module').then(m => m.RegisterConfirmPageModule),
        data: {
          title: {
            text: `Confirmer l'inscription`
          }
        }
      },
      {
        path: 'welcome',
        canActivate: [IsLoggedInGuard, HasVerifiedEmailGuard],
        loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
        data: {
          title: {
            text: 'Bienvenue'
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TabsPage]
})
export class TabsPageModule {}
