import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from 'src/app/controllers/order-list.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'list',
  },
  {
    path: 'list', component: OrderListComponent,
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'list',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
