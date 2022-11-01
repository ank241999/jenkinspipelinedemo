import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IGenetec } from '../interfaces/igenetec';

@Injectable()
export class GenetecConfigurationService {

  constructor(private http: HttpClient) { }

  public addGenetecSettings(genetec: IGenetec): Observable<IGenetec> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    let url: string = environment.apiGatewayUrl + '/VenueGenetecConfiguration';

    return this.http.post<IGenetec>(url, genetec, httpOptions);
  }

  public getAllVenueGenetec(): Observable<IGenetec[]> {
    let url: string = environment.apiGatewayUrl + '/VenueGenetecConfiguration/getAllvenueGenetecConfiguration';

    return this.http.get(url) as Observable<IGenetec[]>;
  }

  public putGenetecSettings(genetec: IGenetec): Observable<IGenetec> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    let url: string = environment.apiGatewayUrl + '/VenueGenetecConfiguration';

    return this.http.put<IGenetec>(url, genetec, httpOptions);
  }

}
