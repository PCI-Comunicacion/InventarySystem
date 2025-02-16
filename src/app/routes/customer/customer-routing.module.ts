import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from '../../controllers/customer-list.component';

const routes: Routes = [
  {
    path: '', redirectTo : 'list', pathMatch: 'full'
  },
  {
    path: 'list', component: CustomerListComponent
  },
  {
    path: '**', redirectTo : 'list', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
