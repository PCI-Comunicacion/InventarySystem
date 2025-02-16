import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesListComponent } from '../../controllers/expenses-list.component';
import { ExpensesCreateDialogComponent } from '../../controllers/expenses-create-dialog.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    //ExpensesListComponent,
    //ExpensesCreateDialogComponent
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule
  ]
})
export class ExpensesModule { }
