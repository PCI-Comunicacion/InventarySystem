import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductCreateDialogComponent } from 'src/app/controllers/product-create-dialog.component';
import { SupplierService } from 'src/app/services/supplier/supplier.service';

@Component({
  selector: 'app-supplier-create-dialog',
  templateUrl: '../views/supplier-create-dialog.component.html',
  styleUrls: ['../templates/supplier/supplier-create-dialog.component.css']
})
export class SupplierCreateDialogComponent implements OnInit{
  accion: any;
  supplierForm!: FormGroup;
  btn: any;
  btn2 = false;
  isDesktop!: boolean;

  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public key: string, 
    private dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    private _supplierService: SupplierService,
    private _toastService: ToastrService 
  ) { 
    this.supplierForm = this.fb.group({
      comercialName: ['', Validators.required],
      isForeign: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      address: ['', Validators.required],
    })

    if(key === ''){
      this.accion = 'Añadir un Nuevo'
      this.btn = 'Guardar'
    }else{
      this.accion = 'Actualizar datos de'
      this.disabledForm();
      this.setValuesForm(key[1]);
      this.btn = 'Editar'
    }
  }
  ngOnInit(): void {
    this.checkDeviceType();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768
  }

  disabledForm(){
    this.supplierForm.get('email')?.disable();
    this.supplierForm.get('address')?.disable();
    this.supplierForm.get('isForeign')?.disable();
    this.supplierForm.get('comercialName')?.disable();
  }

  enabledForm(){
    this.supplierForm.get('email')?.enable();
    this.supplierForm.get('isForeign')?.enable();
    this.supplierForm.get('address')?.enable();
    this.supplierForm.get('comercialName')?.enable();
  }

  setValuesForm(data: any){
    this.supplierForm.get('comercialName')?.setValue(data.comercial_name);
    this.supplierForm.get('isForeign')?.setValue(data.isForeign);
    this.supplierForm.get('email')?.setValue(data.email);
    this.supplierForm.get('address')?.setValue(data.address);
  }

  saveSupplier(){
    if(this.btn === 'Editar' ){
      this.btn2 == true;
      this.enabledForm();
      this.btn = 'Actualizar';
    }else{
      this.createSupplier();
    }
  }

  updateSupplier(){
    if(this.supplierForm.valid){

      const supplier = {
        id: this.key[0],
        comercial_name: this.supplierForm.get('comercialName')?.value.toUpperCase(),
        isForeign: this.supplierForm.get('isForeign')?.value,
        email: this.supplierForm.get('email')?.value,
        address: this.supplierForm.get('address')?.value,
      }

      this._supplierService.updateSupplier(supplier).subscribe(
        (response: any) => {
          this._toastService.success(response.message, 'Correcto', {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
          this.dialogRef.close('updated');
        },
        (error: HttpErrorResponse) => {
          this._toastService.error(error.error.error, error.error.message, {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
        }
      );
    }
    else{
      this.supplierForm.markAllAsTouched();
    }
  }

  createSupplier(){
    if(this.supplierForm.valid){
      const supplier = {
        comercial_name: this.supplierForm.get('comercialName')?.value.toUpperCase(),
        isForeign: this.supplierForm.get('isForeign')?.value,
        email: this.supplierForm.get('email')?.value,
        address: this.supplierForm.get('address')?.value,
      }
      this._supplierService.addSupplier(supplier).subscribe(
        (response: any) => {
          this._toastService.success(response.message, 'Correcto', {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
          this.dialogRef.close('created');
        },
        (error: HttpErrorResponse) => {
          this._toastService.error(error.error.error, error.error.message, {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
        }
      );
    }
    else{
      this.supplierForm.markAllAsTouched();
    }
  }

  cancelar():void{
    this.dialogRef.close();
  }
}
