import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { Role } from '../models/role.model';
import { StatusUser } from '../models/statusUser.model';

@Component({
  selector: 'app-user-create-dialog',
  templateUrl: '../views/user-create-dialog.component.html',
  styleUrls: ['../templates/user/user-create-dialog.component.css']
})

export class UserCreateDialogComponent implements OnInit{
  accion: any;
  userForm!: FormGroup;
  btn: any;
  btn2 = false;
  roleSelected: any;
  statusSelected: any;
  userData: any;
  isDesktop!: boolean;


  roleList: Role[] = [
    { id: 'admin', name: 'Administrador' },
    { id: 'user', name: 'Usuario' }
  ];

  statusList: StatusUser[] = [
    { id: 'true', name: 'Activo' },
    { id: 'false', name: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public key: string, 
    private dialogRef: MatDialogRef<UserCreateDialogComponent>,
    private _userService: UserService,
    private _toastService: ToastrService,
  ){
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      position: ['', Validators.required],
      //role: ['', Validators.required],
      password: ['', Validators.required],
      status:['', Validators.required]
    })

    if(key === ''){
      this.accion = 'Añadir un Nuevo',
      this.userForm.get('role')?.setValue(null);
      this.userForm.get('status')?.setValue(null);
      this.btn = 'Guardar'
    }else{
      this.accion = 'Actualizar datos de '
      this.disabledForm();
      this.setValuesForm(key[1]);
      this.btn = 'Editar'
    }
  }

  disabledForm(){
    this.userForm.get('name')?.disable();
    this.userForm.get('email')?.disable();
    this.userForm.get('position')?.disable();
    this.userForm.get('role')?.disable();
    this.userForm.get('status')?.disable();
  }

  enabledForm(){
    this.userForm.get('name')?.enable();
    this.userForm.get('email')?.enable();
    this.userForm.get('position')?.enable();
    this.userForm.get('role')?.enable();
    this.userForm.get('status')?.enable();
  }

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    await this.loadData();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768
  }

  async loadData() {
    await this._userService.getAllUsers().subscribe( data => {
      this.userData = data;
    });
  } 

  setValuesForm(user: any){
    const role = this.roleList.find(role => role.name === user.role)?.id;
    const status = this.statusList.find(status => status.name === user.status)?.id;
    this.userForm.get('name')?.setValue(user.name);
    this.userForm.get('email')?.setValue(user.email);
    this.userForm.get('position')?.setValue(user.position);
    this.userForm.get('role')?.setValue(role);
    this.userForm.get('status')?.setValue(status);
    this.roleSelected = user.role;
    this.statusSelected = user.status;
  }

  saveUser(){
    if(this.btn === 'Editar' ){
      this.btn2 == true;
      this.enabledForm();
      this.btn = 'Actualizar';
    }else{
      this.createUser();
    }
  }

  updateUser(){
    if(this.userForm.valid){
      const user = {
        id: this.key[0],
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        position: this.userForm.get('position')?.value,
        status: this.userForm.get('status')?.value,
        role: this.userForm.get('role')?.value,
        password: this.userForm.get('password')?.value,
      }

      this._userService.updateUser(user).subscribe({
        next: () => {
          this._toastService.success(
            'Usuario Actualizado!',
            'InvenPci',
          {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
          this.dialogRef.close('updated');
        }, error : (error: HttpErrorResponse) => {
          if(error.error.message === 'USER_NOT_FOUND'){
            this._toastService.error(
              'Usuario no encontrado',
              'Error',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            });
          } else if(error.error.message === 'INVALID_DATA'){
            this._toastService.error(
              'Datos inválidos',
              'Error',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            });
          } else if(error.error.message === 'SOMETHING_WENT_WRONG'){
            this._toastService.error(
              'Algo salió mal, intente más tarde',
              'Error',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            });
          }
        }
      })
    }else{
      this._toastService.error('Por favor, ingrese todos los campos', 'Error', {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: 'decreasing',
      });
    } 
  }

  createUser(){
    if(this.userForm.valid){
      const user = {
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        position: this.userForm.get('position')?.value,
        role: this.userForm.get('role')?.value,
        password: this.userForm.get('password')?.value,
        status: this.userForm.get('status')?.value,
      }
      this._userService.addUser(user).subscribe({
        next: () => {
          this._toastService.success(
            'Usuario Creado!',
            'InvenPci', {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
          this.dialogRef.close('created');
        }, error: (error: HttpErrorResponse) => {
          if(error.error.message === 'USER_ALREADY_EXISTS'){
            this._toastService.error(
              'Usuario con email ya registrado',
              'Error',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            });
          } else if(error.error.message === 'INVALID_DATA'){
            this._toastService.error(
              'Datos inválidos',
              'Error',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            });
          } else if(error.error.message === 'SOMETHING_WENT_WRONG'){
            this._toastService.error(
              'Algo salió mal, intente más tarde',
              'Error',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            });
          }
        }
      });
    }
    else{
      this._toastService.error('Por favor, ingrese todos los campos', 'Error', {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: 'decreasing',
      });
    }
  }

  cancelar():void{
    this.dialogRef.close();
  }
}
