import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../controllers/login.component';
import { ForgotPasswordComponent } from 'src/app/controllers/forgot-password.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },

  {
    path: 'login', component: LoginComponent
  },

  {
    path: 'forgotPassword', component: ForgotPasswordComponent
  },
  
  { 
    path: '**', redirectTo:'login', pathMatch:'full' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
