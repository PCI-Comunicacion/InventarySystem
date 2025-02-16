import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from '../../controllers/user-list.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'list' , pathMatch: 'full'
  },

  {
    path: 'list', component: UserListComponent
  },

  { 
    path: '**', redirectTo:'list', pathMatch:'full' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
