import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'Dashboard',
    loadChildren: () => import('./presentation/presentation.module').then((m) => m.PresentationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
