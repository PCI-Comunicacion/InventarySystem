import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  // Metodo para obtener todos los usuarios
  getAllUsers(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/user/getUsers`, { headers });
  }

  // Metodo para agregar un nuevo usuario
  addUser(user: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/user/signup`, user, { headers });
  }

  // Metodo para enviar el correo de recuperación de contraseña
  sendToEmailPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email };
    return this.http.post<any>(`${this.apiUrl}/user/forgotPassword`, body, { headers });
  }

  // Metodo para buscar un usuario por email
  findUserByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/user/getUserByEmail?email=${email}`;
    return this.http.get<any>(url);
  }

  // Metodo para actualizar el estado de un usuario
  updateUserStatus(id: number, status: boolean): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    const body = { id, status };
    return this.http.put<any>(`${this.apiUrl}/user/updateUserStatus`, body, { headers });
  }

  // Metodo para actualizar un usuario
  updateUser(user: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/user/updateUser`, user, { headers });
  }

  // Metodo para eliminar un usuario
  deleteUser(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.delete<any>(`${this.apiUrl}/user/deleteUser/${id}`, { headers });
  }
}
