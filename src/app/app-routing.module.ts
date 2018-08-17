import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'profile', loadChildren: '../app/profile/profile.module#ProfileModule', canActivate: [AuthGuard]},
  {path: 'auth', loadChildren: '../app/auth/auth.module#AuthModule'},
  {path: 'chat', loadChildren: '../app/chat/chat.module#ChatModule'},
  {path: 'map', loadChildren: '../app/map/map.module#MapModule'},
  {path: '', redirectTo: '/profile', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
