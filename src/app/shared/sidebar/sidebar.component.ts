import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @HostListener('window:resize', ['$event'])
  
  sidebarToggled: boolean = true;
  nameUser: any;
  position: any;
  image_profile: any;
  role: any;

  constructor(private _authService: AuthService, private _router: Router) { }

  onResize(event: any) {
    this.checkScreenWidth();
  }

  ngOnInit(): void {
    this.checkScreenWidth();
    // Metodo para obtener los datos del usuario logeado
    this._authService.getUser().subscribe(data => {
      const user = JSON.parse(data);
      this.nameUser = user.name;
      this.position = user.position;
      this.role = user.role;
      this.image_profile = '../../../assets/resources/user.png';
    });
  }

  // Metodo para validar si el usuario logeado es administrador
  isAdmin(): boolean{
    if(this.role == "admin"){
      return true;
    }else{
      return false;
    }
  }

  // Metodo para abrir el sidebar
  toggleSidebar(): void {
    this.sidebarToggled = !this.sidebarToggled;
  }

  // Metodo para validar el ancho de la pantalla y cerrar el sidebar si es menor o igual a 768px
  private checkScreenWidth(): void {
    if (window.innerWidth <= 768) { // Cambia 768 según tu necesidad de diseño
      this.sidebarToggled = false;
    }
  }

  // Metodo para cerrar el sidebar
  closeToggleSidebar(): void{
    this.sidebarToggled = !this.sidebarToggled;
  }

  // Metodo para cerrar sesion
  logOut(){
    this._authService.logout().subscribe( (data: any) => {
      this._authService.removeToken();
      this._authService.removeUser();
      this._router.navigate(["/login"]);
    }), (error: Error) => {  
    }
  }
}
