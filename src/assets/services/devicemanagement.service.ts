import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITablet } from '../interfaces/itablet';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IDevice } from '../interfaces/idevice';

@Injectable()
export class DevicemanagementService {

  constructor(private http: HttpClient) { }

  public getDevices(): Observable<IDevice[]> {
    return this.http.get(environment.apiGatewayUrl + '/device/getAllDevice') as Observable<IDevice[]>;
  }

  public updateDevice(device: IDevice): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.put(environment.apiGatewayUrl + '/device', device, httpOptions)
  }

  public createDevice(device: IDevice): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.apiGatewayUrl + '/device', device, httpOptions)
  }

  public deleteDevice(selectedDeviceIds: string): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.apiGatewayUrl + '/device/deleteDevice/' + selectedDeviceIds, httpOptions)
  }

}
