import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from '../../controllers/customer-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomerCreateDialogComponent } from '../../controllers/customer-create-dialog.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerCreateDialogComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
