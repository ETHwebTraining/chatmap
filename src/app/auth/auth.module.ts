import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { EmailPasswordComponent } from './components/email-password/email-password.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
  ],
  declarations: [
    LoginComponent,
    EmailPasswordComponent
  ]
})
export class AuthModule { }
