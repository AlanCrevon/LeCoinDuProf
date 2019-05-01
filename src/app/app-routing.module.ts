import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/shared',
    pathMatch: 'full'
  },
  {
    path: 'app',
    redirectTo: 'app/shared',
    pathMatch: 'full'
  },
  {
    path: 'app',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
