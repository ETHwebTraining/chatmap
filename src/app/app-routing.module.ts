import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*
  defining the root routes of the application
  using lazyloading for all of the routes
*/

const routes: Routes = [
  {path: 'profile', loadChildren: '../app/profile/profile.module#ProfileModule', canActivate: [AuthGuard]},
  {path: 'auth', loadChildren: '../app/auth/auth.module#AuthModule'},
  {path: 'chat', loadChildren: '../app/chat/chat.module#ChatModule', canActivate: [AuthGuard]},
  {path: 'map', loadChildren: '../app/map/map.module#MapModule', canActivate: [AuthGuard]},
  {path: '', redirectTo: '/profile', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
