import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Metodo para hacer login en la API
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };   
    return this.http.post<any>(`${this.apiUrl}/user/login`, body, { headers });
  }

  //TestAPI 
  test(): Observable<string>{
    return this.http.get(`${this.apiUrl}/user/testAPI`, { responseType: 'text' });
  }

  // Metodo para guardar el token en el local storage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Metodo para remover el token del local storage
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Metodo para obtener el token del local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Metodo para guardar el usuario en el local storage
  saveUser(user: string): void{
    localStorage.setItem('currentUser', user);   
  }

  // Metodo para remover el usuario del local storage
  removeUser(): void{
    localStorage.removeItem('currentUser');   
  }

  // Metodo para obtener el usuario del local storage
  getUser(): Observable<any> {
    const user = localStorage.getItem('currentUser');
    return of(user);   
  }

  // Metodo para logout
  logout(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/user/logout`,  {}, { headers });
  }

  // Metodo para verificar si el usuario está logueado
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

}
