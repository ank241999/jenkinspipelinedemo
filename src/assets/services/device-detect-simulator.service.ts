import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IDeviceDetect } from '../interfaces/idevicedetect';

@Injectable()
export class DeviceDetectSimulatorService {

  constructor(private http: HttpClient) { }

  /*public detectDevice(deviceDetail: any): Observable<string> {
    var detail = {
      "leftMacAddress": deviceDetail,
      "rightMacAddress": deviceDetail
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.post<string>(environment.apiGatewayUrl + '/detect', detail, httpOptions);
  }*/

  public detectDevice(deviceMacAddress: string): Observable<string> {
    //let url: string = environment.apiGatewayUrl + '/api/deviceDetect?macAddress='+deviceMacAddress;
    let url: string = environment.apiGatewayUrl + '/device/detect/' + deviceMacAddress;
    return this.http.get(url) as Observable<string>;
  }

  public sendStatus(status: IDeviceDetect): Observable<string> {
    let url: string = environment.apiGatewayUrl + '/device/detection-result';
    return this.http.post(url, status) as Observable<string>;
  }
}
