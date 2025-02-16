import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  addCustomer(customer: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/customer/add`, customer, { headers });
  }

  updateCustomer(customer: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${this.apiUrl}/customer/update`, customer, { headers });
  }
  
  getAllCustomers(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this._authService.getToken();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${this.apiUrl}/customer/getCustomer`, { headers });
  }
}
