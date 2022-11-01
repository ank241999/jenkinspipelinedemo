import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILocation } from '../interfaces/ilocation';
import { IEntrance } from '../interfaces/ientrance';
import { IDevice } from '../interfaces/idevice';
import { environment } from '../../environments/environment';

@Injectable()
export class DeviceSetupService {

    constructor(private http: HttpClient) { }

    public getLocation(customerId: number): Observable<ILocation[]> {
        let url: string = environment.apiGatewayUrl + '/location';
        if (customerId > 0) {
            url = url + '?customerId=' + customerId;
        }
        return this.http.get(url) as Observable<ILocation[]>;
    }

    public getEntrances(locationid: number): Observable<IEntrance[]> {
        let url: string = environment.apiGatewayUrl + '/entrance';
        if (locationid > 0) {
            url = url + '?locationId=' + locationid;
        }
        return this.http.get(url) as Observable<IEntrance[]>;
    }

    public getDevice(locationid: number, entranceID: number, deviceID: number): Observable<IDevice[]> {
        let url: string = environment.apiGatewayUrl + '/device/' + locationid + '/' + entranceID + '/' + deviceID;

        return this.http.get(url) as Observable<IDevice[]>;
    }

    public getAllGateDevices(locationid: number, entranceID: number): Observable<IDevice[]> {
        let url: string = environment.apiGatewayUrl + '/device/' + locationid + '/' + entranceID;

        return this.http.get(url) as Observable<IDevice[]>;
    }

    public putDevice(locationid: number, entranceID: number, laneId: string, device: IDevice): Observable<IDevice> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/device/' + locationid + '/' + entranceID + '/' + laneId;

        return this.http.put<IDevice>(url, device, httpOptions);
    }

    public deleteLaneInfo(locationId: number, entranceID: number, laneID: string): Observable<IDevice> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
            })
          };
        let url: string = environment.apiGatewayUrl + '/device/' + locationId + '/' + entranceID + '/' + laneID;

        return this.http.delete<IDevice>(url, httpOptions);
        
    }
}
