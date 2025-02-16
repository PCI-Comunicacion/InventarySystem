import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KardexListComponent } from '../../controllers/kardex-list.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list', component: KardexListComponent
  },
  {
    path: '**', redirectTo: 'list', pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexRoutingModule { }
