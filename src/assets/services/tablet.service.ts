import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITablet } from '../interfaces/itablet';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class TabletService {

  constructor(private http: HttpClient) { }

  public getTablets(): Observable<ITablet[]>{
    return this.http.get(environment.apiGatewayUrl + '/tablet') as Observable<ITablet[]>;
  }

  public addTablet(tablet: ITablet): Observable<ITablet>{
    return this.http.post(environment.apiGatewayUrl + '/tablet', tablet);
  }

  public updateTablet(tablet: ITablet) :Observable<ITablet>{
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      })
  };
    return this.http.put(environment.apiGatewayUrl + '/tablet', tablet, httpOptions )
  }

  public deleteTablet(ids: number[]): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<ITablet>(environment.apiGatewayUrl + '/tablet/delete/', ids, httpOptions);
  }
}
