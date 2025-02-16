import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../services/category/category.service';
import { ProductService } from '../services/product/product.service';
import { SupplierService } from '../services/supplier/supplier.service';
import { IncomeService } from '../services/income/income.service';
import { KardexService } from '../services/kardex/kardex.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-create-dialog',
  templateUrl: '../views/product-create-dialog.component.html',
  styleUrls: ['../templates/product/product-create-dialog.component.css']
})
export class ProductCreateDialogComponent implements OnInit {
  accion: any;
  productForm!: FormGroup;
  btn: any;
  btn2 = false;
  categoryList: any;
  categorySelected: any;
  isDesktop!: boolean;

  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public key: string, 
    private dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    private _productService: ProductService,
    private _toastService: ToastrService,
    private _categoryService: CategoryService,
  ){
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      //description : ['', Validators.required],
      price_purchase: ['', Validators.required],
      price_sale: ['', Validators.required],

      entryDate: ['', Validators.required],
      nameCategory: ['', Validators.required],
    })

    if(key === ''){
      this.accion = 'Añadir un nuevo',
      this.productForm.get('nameCategory')?.setValue(null);
      this.btn = 'Guardar'
    }else{
      this.accion = 'Actualizar datos de '
      this.disabledForm();
      this.setValuesForm(key[1]);
      this.btn = 'Editar'
    } 
  }

  disabledForm(){
    this.productForm.get('name')?.disable();
    this.productForm.get('description')?.disable();
    this.productForm.get('price_purchase')?.disable();
    this.productForm.get('price_sale')?.disable();
    this.productForm.get('entryDate')?.disable();
    this.productForm.get('nameCategory')?.disable();
  }

  enabledForm(){
    this.productForm.get('name')?.enable();
    this.productForm.get('description')?.enable();
    this.productForm.get('price_purchase')?.enable();
    this.productForm.get('price_sale')?.enable();
    this.productForm.get('entryDate')?.enable();
    this.productForm.get('nameCategory')?.enable();
  }

  ngOnInit(): void {
    this.checkDeviceType();
    this._categoryService.getAllCategories().subscribe(
      (response: any) => {
        this.categoryList = response.data.categories;
      }, 
      (error: HttpErrorResponse) => {
        this._toastService.error(error.error.error, error.error.message, {
          progressBar: true,
          timeOut: 2000,
          progressAnimation: "decreasing",
        });
      }
    );
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  setValuesForm(data: any){
    this.productForm.get('name')?.setValue(data.name);
    this.productForm.get('description')?.setValue(data.description);
    this.productForm.get('price_purchase')?.setValue(data.price_purchase);
    this.productForm.get('price_sale')?.setValue(data.price_sale);
    this.productForm.get('entryDate')?.setValue(this.formatDate(data.entryDate));
    this.categorySelected = data.nameCategory;
    this.productForm.get('nameCategory')?.setValue(data.category_id);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  saveProduct(){
    if(this.btn === 'Editar' ){
      this.btn2 == true;
      this.enabledForm();
      this.btn = 'Actualizar';
    }else{
      this.createProduct();
    }
  }

  updateProduct(){
    if(this.productForm.valid){
      const product = {
        id: this.key[0],
        name: this.productForm.get('name')?.value,
        //description: this.productForm.get('description')?.value,
        price_sale: this.productForm.get('price_sale')?.value,
        price_purchase: this.productForm.get('price_purchase')?.value,
        stock: 0,
        entryDate: this.productForm.get('entryDate')?.value,
        category_id: this.productForm.get('nameCategory')?.value,
      }

        if(Number(product.price_purchase) < 0){
          this._toastService.error('El precio de compra no puede ser menor a 0', 'Error', {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
        } else{
          this._productService.updateProduct(product).subscribe(
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
    }
    else{
      this.productForm.markAllAsTouched();
    }
  }

  createProduct(){
    if(this.productForm.valid){
      const product = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        price_sale: this.productForm.get('price_sale')?.value,
        price_purchase: this.productForm.get('price_purchase')?.value,
        stock: 0,
        entryDate: this.productForm.get('entryDate')?.value,
        category_id: this.productForm.get('nameCategory')?.value,
      }

      if(Number(product.price_purchase) <= 0){
          this._toastService.error('El precio de compra no puede ser menor a 0', 'Error', {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
        } else{
          this._productService.addProduct(product).subscribe(
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
          )
        }
    }
    else{
      this.productForm.markAllAsTouched();
    }
  }

  calculateSalePrice(purchasePrice: number): number {
    return purchasePrice * 1.30;
  }

  cancelar():void{
    this.dialogRef.close();
  }
}
