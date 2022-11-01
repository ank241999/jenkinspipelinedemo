import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEntrance } from '../interfaces/ientrance';
import { environment } from '../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class AddgateService {
  constructor(private http: HttpClient) { }

  public getGates(): Observable<IEntrance[]> {
    return this.http.get(environment.apiGatewayUrl + '/entrance') as Observable<IEntrance[]>;
  }

  public getGateByLocationId(locationId: number): Observable<IEntrance[]> {
    return this.http.get(environment.apiGatewayUrl + '/entrance?locationId=' + locationId) as Observable<IEntrance[]>;
  }

  public getGateByIds(id: number, locationId: number): Observable<IEntrance> {
    return this.http.get(environment.apiGatewayUrl + '/entrance?id=' + id + '&locationId=' + locationId) as Observable<IEntrance>;
  }

  public addgate(entrance: IEntrance): Observable<IEntrance> {
    return this.http.post<IEntrance>(environment.apiGatewayUrl + '/entrance', entrance);
  }

  public updateGates(entrance: IEntrance[]): Observable<IEntrance> {
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    return this.http.put<IEntrance>(environment.apiGatewayUrl + '/entrance', entrance, httpOptions);
}

  public deleteGate(ids: number[]): Observable<IEntrance> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<IEntrance>(environment.apiGatewayUrl + '/entrance/delete/', ids, httpOptions);
  }
}
