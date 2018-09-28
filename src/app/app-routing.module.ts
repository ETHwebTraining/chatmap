import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'profile', canActivate: [AuthGuard], loadChildren: '../app/profile/profile.module#ProfileModule'},
  {path: 'auth', loadChildren: '../app/auth/auth.module#AuthModule'},
  {path: '', redirectTo: '/auth', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
