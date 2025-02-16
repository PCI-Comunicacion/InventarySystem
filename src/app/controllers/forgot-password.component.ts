import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: '../views/forgot-password.component.html',
  styleUrls: ['../templates/auth/forgot-password.component.css']
})
export class ForgotPasswordComponent {
  loading = false;
  recoveryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _userService: UserService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]], 
    })
  }

  sendToEmailPassword(){
    this.loading = true;
    if(this.recoveryForm.valid){
      const email = this.recoveryForm.get('email')?.value;
      this._userService.sendToEmailPassword(email).subscribe({
        next: (response) => {
          this._toastr.success(response.message, "InvenPci", {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: "decreasing",
          });
          this.loading = false;
        }, error: (error: HttpErrorResponse) => {
          this._toastr.error(error.error.error, error.error.message, {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: "decreasing",
          });
          this.loading = false;
        }  
      });
    } 
    else{
      this._toastr.error('Por favor, ingrese un correo válido', 'Error', {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: 'decreasing',
      });
      this.loading = false;
    }
  }

  goToLogin(){
    this._router.navigate(['/']);
  }
}
