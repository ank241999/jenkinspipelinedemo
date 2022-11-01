import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILocation } from '../interfaces/ilocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  public getLocation(): Observable<ILocation[]> {
    return this.http.get<ILocation>(environment.apiGatewayUrl + '/location') as Observable<ILocation[]>;;
  }

  public getLocationByCustomerId(customerId: number): Observable<ILocation[]> {
    let url: string = environment.apiGatewayUrl + '/location';
    if (customerId > 0) {
      url = url + '?customerId=' + customerId;
    }
    return this.http.get(url) as Observable<ILocation[]>;
  }

  public getLocationById(locationId: number): Observable<ILocation[]> {
    return this.http.get<ILocation>(environment.apiGatewayUrl + '/location?id=' + locationId) as Observable<ILocation[]>;
  }

  public addLocation(location: ILocation): Observable<ILocation> {
    return this.http.post<ILocation>(environment.apiGatewayUrl + '/location', location);
  }

  public updateLocation(locationId: number, locationName: string, customerId: number, formData: FormData): Observable<ILocation> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'type': 'formData',
        'Access-Control-Allow-Origin': '*'
      })
    };

    let url: string = environment.apiGatewayUrl + '/location?name=' + locationName + "&id=" + locationId
      + "&customerId=" + customerId;

    return this.http.put<ILocation>(url, formData, httpOptions);
  }

  public deleteLocation(ids: number[]): Observable<ILocation> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<ILocation>(environment.apiGatewayUrl + '/location/delete/', ids, httpOptions);
  }
}