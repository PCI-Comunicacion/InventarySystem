import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { IncomeService } from 'src/app/services/income/income.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SupplierService } from 'src/app/services/supplier/supplier.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
  id!: any;
  tableName!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public key: string,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private _supplierService: SupplierService,
    private _customerService: CustomerService,
    private _productService: ProductService,
    private _incomeService: IncomeService,
    private _userService: UserService,
    private _expenseService: ExpensesService,
    private _toastService: ToastrService
  ) { }
 
  ngOnInit() {
    this.id = this.key[0];
    this.tableName = this.key[1];
  }

  //Metodo de Eliminar
  delete(): void{
    if(this.tableName === 'supplier'){
      this._supplierService.deleteSupplier(this.id).subscribe(  () => {}, error => {
        if(error.status === 200){
          this.dialogRef.close('deleted');
        } else 
        if(error.status === 401){ 
          this.dialogRef.close('error');
        }
      });
    // } else if(this.tableName === 'customer'){
    //   this._customerService.deleteCustomer(this.id).subscribe(  () => {}, error => {
    //     if(error.status === 200){
    //       this.dialogRef.close('deleted');
    //     } else 
    //     if(error.status === 401){ 
    //       this.dialogRef.close('error');
    //     }
    //   });
    }
    else if(this.tableName === 'product'){
      this._productService.deleteProduct(this.id).subscribe({
        next: () => {
          this._toastService.success('Producto eliminado con éxito', 'Producto Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.dialogRef.close('deleted');
        }, error: (error: HttpErrorResponse) => {
          if(error.error.message === 'PRODUCT_NOT_FOUND'){
            this.dialogRef.close('error');
          } else if(error.error.message === 'SOMETHING_WENT_WRONG'){
            this.dialogRef.close('error');
          } else if(error.error.message === 'UNAUTHORIZED_ACCESS'){
            this.dialogRef.close('error');
          }
        }
      });
    }
    else if(this.tableName === 'order_sale'){
      this._expenseService.deleteExpenses(this.id).subscribe( () => {}, error => {
        if(error.status === 200){
          this.dialogRef.close('deleted');
        } else 
        if(error.status === 401){ 
          this.dialogRef.close('error');
        }
      });
    }
    else if(this.tableName === 'order_purchase'){
      this._incomeService.deleteIncome(this.id).subscribe( () => {}, error => {
        if(error.status === 200){
          this.dialogRef.close('deleted');
        } else 
        if(error.status === 401){ 
          this.dialogRef.close('error');
        }
      });
    }
    else if(this.tableName === 'user'){
      this._userService.deleteUser(this.id).subscribe({
        next: () => {
          this._toastService.success('Usuario eliminado con éxito', 'Usuario Eliminado',{
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.dialogRef.close('deleted');
        }, error: (error: HttpErrorResponse) => {
          if(error.error.message === 'USER_NOT_FOUND'){
            this.dialogRef.close('error');
          } else if(error.error.message === 'SOMETHING_WENT_WRONG'){
            this.dialogRef.close('error');
          } else if(error.error.message === 'UNAUTHORIZED_ACCESS'){
            this.dialogRef.close('error');
          }
        }
      }
      );
    }
  }

  //Metodo de cancelar
  cancelar():void{
    this.dialogRef.close('canceled');
  }
}
