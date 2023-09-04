import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/routes';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.auth.login,
    pathMatch: 'full'
  },
  {
    path: AppRoutes.auth.login,
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
