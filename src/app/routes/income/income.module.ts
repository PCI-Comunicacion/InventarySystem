import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeRoutingModule } from './income-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { IncomeCreateComponent } from '../../controllers/income-create.component';


@NgModule({
  declarations: [
    // IncomeCreateComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    SharedModule
  ]
})
export class IncomeModule { }
