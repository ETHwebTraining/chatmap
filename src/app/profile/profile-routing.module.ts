import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';

const profileRoutes: Routes = [
  {path: '', component: ProfileComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(profileRoutes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutingModule { }
