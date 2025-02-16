import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SupplierCreateDialogComponent } from '../../controllers/supplier-create-dialog.component';
import { SupplierListComponent } from '../../controllers/supplier-list.component';
import { SharedModule } from '../../shared/shared.module';
import { SuppliersRoutingModule } from './suppliers-routing.module';


@NgModule({
  declarations: [
    SupplierListComponent,
    SupplierCreateDialogComponent
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    SharedModule
  ]
})
export class SuppliersModule { }
