import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from '../app-material.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SignupComponent, SigninComponent],
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    RouterModule,
    AuthRoutingModule
  ],
  exports: [],
  providers: []
})
export class AuthModule {}
