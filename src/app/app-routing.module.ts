import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'auth',
    pathMatch: 'full'
  },

  {
    path: 'auth', loadChildren: ()=> import('./routes/auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'user', 
    component: SidebarComponent,  
    loadChildren: ()=> import('./routes/user/user.module').then(m=>m.UserModule),
    canActivate: [AuthGuard],
    data: { role: 'admin'}
  },
  {
    path: 'product', 
    component: SidebarComponent, 
    loadChildren: ()=> import('./routes/product/product.module').then(m=>m.ProductModule),
    canActivate: [AuthGuard],
    data: { role: 'user'}
  },

  {
    path: 'supplier', 
    component: SidebarComponent, 
    loadChildren: ()=> import('./routes/supplier/suppliers.module').then(m=>m.SuppliersModule),
    canActivate: [AuthGuard],
    data: { role: 'user' }
  },

  {
    path: 'customer', 
    component: SidebarComponent, 
    loadChildren: ()=> import('./routes/customer/customer.module').then(m=>m.CustomerModule),
    canActivate: [AuthGuard],
    data: { role: 'user' }
  },
  {
    path: 'order',
    component: SidebarComponent,
    loadChildren: ()=> import('./routes/order/order.module').then(m=>m.OrderModule),
    canActivate: [AuthGuard],
    data: { role: 'user' }
  },
  {
    path: 'dashboard',
    component: SidebarComponent,
    loadChildren: ()=> import('./routes/dashboard/dashboard.module').then(m=>m.DashboardModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: 'kardex',
    component: SidebarComponent,
    loadChildren: ()=> import('./routes/kardex/kardex.module').then(m=>m.KardexModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  { 
    path: '**', redirectTo:'auth', pathMatch:'full' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
