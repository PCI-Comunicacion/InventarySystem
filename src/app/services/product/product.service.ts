import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  getAllProducts(): Observable<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/product/getProducts`, { headers });
  }

  addProduct(product: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/product/add`, product, { headers, responseType: 'json' });
  }

  deleteProduct(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.delete<any>(`${this.apiUrl}/product/delete/${id}`, { headers, responseType: 'json' });
  }

  updateProduct(product: any): Observable<any> {  
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/product/update`, product, { headers, responseType: 'json' });
  }
  
  getProductById(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/product/getById/${id}`, { headers });
  }

  updateStock(id: any, stockChange: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.patch<any>(`${this.apiUrl}/product/update-stock/${id}?stockChange=${stockChange}`,{},  { headers, responseType: 'json' });
  }
}
