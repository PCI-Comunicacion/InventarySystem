import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  // Metodo para crear una nueva compra
  addIncome(income: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/purchaseOrders/add`, { income }, { headers, responseType: 'json' });	
  }

  // Metodo para obtener todas las compras
  getAllIncome(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/purchaseOrders/getAll`, { headers });
  }

  // Metodo para eliminar una compra
  deleteIncome(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.delete<any>(`${this.apiUrl}/purchaseOrders/delete/${id}`, { headers });
  }

  // Metodo para obtener un Detalle compra por su id
  getDetailIncomeById(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/purchaseOrders/getDetail/${id}`, { headers });
  }

  // Metodo para obtener una compra por su id
  getIncomeById(id: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/purchaseOrders/getById/${id}`, { headers });
  }

  // get chart data chartData
  getChartData(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/purchaseOrders/chartData`, { headers });
  }
}
