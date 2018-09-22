import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { EmailPasswordComponent } from './components/email-password/email-password.component';
import { OAuthComponent } from './components/o-auth/o-auth.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    EmailPasswordComponent,
    OAuthComponent
  ]
})
export class AuthModule { }
