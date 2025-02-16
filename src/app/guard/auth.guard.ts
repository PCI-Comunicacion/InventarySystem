import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser: any;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authService.getUser().subscribe(data => {
     this.currentUser = JSON.parse(data);
    });

    if(this.currentUser){
      const toles = route.data['role'] as string;
      if(toles && toles.indexOf(this.currentUser.role) === -1){
        this.router.navigate(['/auth']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
