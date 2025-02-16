import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  // Metodo para obtener todas las categorías
  getAllCategories(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/category/getAllCategory`, { headers });
  }

  // Metodo para crear una categoría
  createCategory(name: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/category/add`, { name }, { headers });
  }

  // Metodo para actualizar una categoría
  updateCategory(category: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/category/updateCategory`, category , { headers, responseType: 'json' });
  }
}
