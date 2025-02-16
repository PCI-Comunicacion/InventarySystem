import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KardexRoutingModule } from './kardex-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { KardexListComponent } from '../../controllers/kardex-list.component';

@NgModule({
  declarations: [
    KardexListComponent
  ],
  imports: [
    CommonModule,
    KardexRoutingModule,
    SharedModule
  ]
})
export class KardexModule { }
