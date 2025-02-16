import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeListComponent } from '../../controllers/income-list.component';

const routes: Routes = [
  // {
  //   path: '', redirectTo: 'list', pathMatch: 'full'
  // },
  // {
  //   path: 'list', component: IncomeListComponent
  // },
  // {
  //   path: '**', redirectTo: 'list', pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule { }
