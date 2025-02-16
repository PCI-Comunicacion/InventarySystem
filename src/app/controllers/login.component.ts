import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";

function domainValidator(domains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const email = control.value;
    const isValidDomain = domains.some((domain) =>
      email.endsWith(`@${domain}`)
    );

    return isValidDomain ? null : { invalidDomain: true };
  };
}

@Component({
  selector: "app-login",
  templateUrl: "../views/login.component.html",
  styleUrls: ["../templates/auth/login.component.css"],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loading = false;
  subscriptionUser: Subscription = new Subscription();
  subscriptionLogin: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _loginService: AuthService,
    private _userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          domainValidator(["gmail.com", "outlook.com", "hotmail.com"]),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptionLogin.unsubscribe();
  }

  login() {
    this.loading = true;
    if (this.loginForm.valid) {
      const email = this.loginForm.get("email")?.value;
      const password = this.loginForm.get("password")?.value;
      setTimeout(() => {
        try {
          this.subscriptionLogin = this._loginService
            .login(email, password)
            .subscribe({
              next: (response) => {
                this._toastr.success( 
                  "Ingreso exitoso!", "InvenPci", {
                  progressBar: true,
                  timeOut: 2000,
                  progressAnimation: "decreasing",
                });
                this._loginService.saveToken(response.data.token);
                this._userService.findUserByEmail(email).subscribe({
                  next: async (responseUser) => {
                    await this.sendUserDataLocalStorage(responseUser.data.user);
                    if (responseUser.data.user.role === "admin") {
                      this._router.navigate(["/dashboard"]);
                    } else {
                      this._router.navigate(["/product"]);
                    }
                  },
                  error: (error: HttpErrorResponse) => {
                    this._toastr.error(error.error.error, error.error.message, {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    });
                  },
                });
              },
              error: (error: HttpErrorResponse) => {
                if (error.status === 0) {
                  this._toastr.error(
                    "No se pudo conectar con el servidor",
                    "Error!",
                    {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    }
                  );
                  this.loading = false;
                } else if(error.error.message === "USER_PENDING"){
                  this._toastr.error(
                    "Usuario pendiente de aprobación",
                    "Error!",
                    {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    }
                  );
                  this.loading = false;
                } else if(error.error.message === "USER_PASSWORD_ERROR"){
                  this._toastr.error(
                    "Contraseña incorrecta",
                    "Error!",
                    {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    }
                  );
                  this.loading = false;
                } else if(error.error.message === "SOMETHING_WENT_WRONG"){
                  this._toastr.error(
                    "Algo salió mal, intente más tarde",
                    "Error!",
                    {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    }
                  );
                  this.loading = false;
                } else if(error.error.message === "USER_NOT_FOUND"){
                  this._toastr.error(
                    "Usuario no registrado!",
                    "Error!",
                    {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    }
                  );
                  this.loading = false;
                }
              },
            });
        }catch(error){ 
          console.log(error);
        }
      }, 2000);
    } else {
      this.loading = false;
    }
  }

  async sendUserDataLocalStorage(data: any): Promise<void> {
    try {
      const token = this._loginService.getToken();
      if (token) {
        const decoded: any = jwtDecode(token);
        const userRole = decoded.role;
        const user = {
          ...data,
          role: userRole,
        };
        this._loginService.saveUser(JSON.stringify(user));
      } else {
        throw new Error("Token not found");
      }
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  }
}
