import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  // Metodo para obtener todos los proveedores
  getAllSuppliers(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/supplier/getSupplier`, { headers });
  }

  // Metodo para agregar un nuevo proveedor
  addSupplier(supplier: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/supplier/add`, supplier , { headers, responseType: 'json' });
  }

  // Metodo para eliminar un proveedor
  deleteSupplier(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);// Corrección aquí
    return this.http.delete<any>(`${this.apiUrl}/supplier/delete/${id}`, { headers, responseType: 'json' });
  }

  // Metodo para actualizar datos de un proveedor
  updateSupplier(supplier: any): Observable<any> {  
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);// Corrección aquí
    return this.http.post<any>(`${this.apiUrl}/supplier/update`, supplier, { headers, responseType: 'json' });
  }
}
