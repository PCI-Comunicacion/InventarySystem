import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { EcuadorIdValidatorService } from 'src/app/shared/ecuador-id-validator/ecuador-id-validator.service';

@Component({
  selector: 'app-customer-create-dialog',
  templateUrl: '../views/customer-create-dialog.component.html',
  styleUrls: ['../templates/customer/customer-create-dialog.component.css'],
})
export class CustomerCreateDialogComponent implements OnInit {
  accion: any;
  customerForm!: FormGroup;
  btn: any;
  btn2 = false;
  isDesktop!: boolean;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public key: string,
    private dialogRef: MatDialogRef<CustomerCreateDialogComponent>,
    private _customerService: CustomerService,
    private _toastService: ToastrService,
    private _ecuadorIdValidatorService: EcuadorIdValidatorService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      identification: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
    if (key === '') {
      this.accion = 'Añadir un nuevo';
      this.btn = 'Registrar';
    } else {
      this.accion = 'Actualizar datos de';
      this.disabledForm();
      this.setValuesForm(key[1]);
      this.btn = 'Editar';
    }
  }

  ngOnInit(): void {
    this.checkDeviceType();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  disabledForm() {
    this.customerForm.get('identification')?.disable();
    this.customerForm.get('email')?.disable();
    this.customerForm.get('phone_number')?.disable();
    this.customerForm.get('address')?.disable();
    this.customerForm.get('surname')?.disable();
    this.customerForm.get('name')?.disable();
  }

  enabledForm() {
    this.customerForm.get('identification')?.enable();
    this.customerForm.get('email')?.enable();
    this.customerForm.get('phone_number')?.enable();
    this.customerForm.get('address')?.enable();
    this.customerForm.get('surname')?.enable();
    this.customerForm.get('name')?.enable();
  }

  setValuesForm(data: any) {
    this.customerForm.patchValue(data);
  }

  saveCustomer() {
    if (this.btn === 'Editar') {
      this.btn2 == true;
      this.enabledForm();
      this.btn = 'Actualizar';
    } else {
      this.createCustomer();
    }
  }

  updateCustomer() {
    if (this.customerForm.valid) {
      const customer = {
        id: this.key[0],
        name: this.customerForm.get('name')?.value.toUpperCase(),
        surname: this.customerForm.get('surname')?.value.toUpperCase(),
        identification: this.customerForm.get('identification')?.value,
        address: this.customerForm.get('address')?.value,
        phone_number: this.customerForm.get('phone_number')?.value,
        email: this.customerForm.get('email')?.value,
      };

      if (this._ecuadorIdValidatorService.validateId(customer.identification)) {
        this._customerService.updateCustomer(customer).subscribe(
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
      } else {
        this._toastService.error(
          'La cédula no es válida o no existe',
          'Fomato Incorrecto!',
          {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          }
        );
      }
    }
    else {
      this.customerForm.markAllAsTouched();
    }
  }

  async createCustomer() {
    if (this.customerForm.valid) {
      const customer = {
        name: this.customerForm.get('name')?.value.toUpperCase(),
        surname: this.customerForm.get('surname')?.value.toUpperCase(),
        identification: this.customerForm.get('identification')?.value,
        address: this.customerForm.get('address')?.value,
        phone_number: this.customerForm.get('phone_number')?.value,
        email: this.customerForm.get('email')?.value,
      };
      if (this._ecuadorIdValidatorService.validateId(customer.identification)) {
        this._customerService.addCustomer(customer).subscribe(
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
      } else {
        this._toastService.error(
          'La cédula no es válida o no existe',
          'Fomato Incorrecto!',
          {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          }
        );
      }
    }
    else {
      this.customerForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.btn = 'Editar';
    this.disabledForm();
  }

  closedModal() {
    this.dialogRef.close();
  }
}
