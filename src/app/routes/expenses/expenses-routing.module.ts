import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesListComponent } from '../../controllers/expenses-list.component';

const routes: Routes = [
  // {
  //   path: '', redirectTo: 'list', pathMatch: 'full'
  // },
  // {
  //   path: 'list', component: ExpensesListComponent
  // },
  // {
  //   path: '**', redirectTo: 'list', pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
