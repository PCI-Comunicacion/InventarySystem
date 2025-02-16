import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from '../../controllers/product-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductCreateDialogComponent } from '../../controllers/product-create-dialog.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCreateDialogComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule
  ]
})
export class ProductModule { }
