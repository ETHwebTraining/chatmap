import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';


const authRoutes: Routes = [
  {path: '', component: LoginComponent},
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
