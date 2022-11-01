import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICustomer } from '../interfaces/icustomer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<ICustomer[]> {
    return this.http.get(environment.apiGatewayUrl + "/customer") as Observable<ICustomer[]>;
  }

  public createCustomer(customer: ICustomer): Observable<ICustomer> {
    return this.http.post<ICustomer>(environment.apiGatewayUrl + '/customer', customer);
  }
  
  public updateCustomer(customer: ICustomer): Observable<ICustomer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.put<ICustomer>(environment.apiGatewayUrl + '/customer', customer, httpOptions);
  }

  public deleteCustomer(ids: number[]): Observable<ICustomer> {
    // return this.http.delete<IUser>(environment.apiGatewayUrl + '/user/',ids);
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<ICustomer>(environment.apiGatewayUrl + '/customer/delete/', ids, httpOptions);
  }
}
