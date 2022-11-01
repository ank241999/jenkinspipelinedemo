import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILocation } from '../interfaces/ilocation';
import { IEntrance } from '../interfaces/ientrance';
import { IDevice } from '../interfaces/idevice';
import { environment } from '../../environments/environment';
import { ILane } from '../interfaces/ilane';
import { IDashboardDetails, IDeviceDetails } from '../interfaces/idashboarddetails';
import { ITablet } from '../interfaces/itablet';
import { IDeviceTablet } from '../interfaces/idevicetablet';

@Injectable()
export class LaneDeviceService {

    constructor(private http: HttpClient) { }

    // public getEntrances(locationid: number): Observable<IEntrance[]> {
    //     let url: string = environment.apiGatewayUrl + '/entrance';
    //     if (locationid > 0) {
    //         url = url + '?locationId=' + locationid;
    //     }
    //     return this.http.get(url) as Observable<IEntrance[]>;
    // }

    public createLane(lane: ILane): Observable<IDevice> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/lane/';

        return this.http.post<IDevice>(url, lane, httpOptions);
    }

    public putLane(lane: any): Observable<ILane> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        let url: string = environment.apiGatewayUrl + '/lane';

        return this.http.put<ILane>(url, lane, httpOptions);
    }

    public deleteLaneInfo(laneID: string): Observable<ILane> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/lane/' + laneID;

        return this.http.delete<ILane>(url, httpOptions);

    }

    public getDevice(deviceID: number): Observable<IDevice[]> {
        let url: string = environment.apiGatewayUrl + '/device/' + deviceID;

        return this.http.get(url) as Observable<IDevice[]>;
    }

    public getAllEntranceDevices(entranceID: number): Observable<IDevice[]> {
        let url: string = environment.apiGatewayUrl + '/device/getEntranceDevice?entranceID=' + entranceID;

        return this.http.get(url) as Observable<IDevice[]>;
    }

    public createDevice(device: IDevice): Observable<IDevice> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/device/';

        return this.http.post<IDevice>(url, device, httpOptions);
    }

    public putDevice(device: IDevice): Observable<IDevice> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        let params = new HttpParams();
        params = params.append('deviceId', device.id.toString());
        params = params.append('laneId', device.laneId.toString());
        params = params.append('sPathFlag', device.spathFlag.toString());

        let url: string = environment.apiGatewayUrl + '/device/updateDeviceLane';

        return this.http.put<IDevice>(url, httpOptions, { params: params });
    }

    public getDashboardDetails(): Observable<IDashboardDetails> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/device/dashboardDetails';

        return this.http.get<IDashboardDetails>(url, httpOptions);
    }

    public getTabletInfo(): Observable<ITablet> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/tablet';

        return this.http.get<ITablet>(url, httpOptions);

    }

    public updateTabletInfo(deviceTab: IDeviceTablet): Observable<IDeviceTablet> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/tablet';

        return this.http.put<IDeviceTablet>(url, deviceTab, httpOptions);

    }

    public deleteTablet(tabletID: number): Observable<IDeviceTablet> {
        let httpParams = new HttpParams().set('id', tabletID.toString());

        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }),
            params: httpParams
        };
        let url: string = environment.apiGatewayUrl + '/tablet/';

        return this.http.delete<IDeviceTablet>(url, httpOptions);

    }

    public updateTabletDevice(deviceTab: IDeviceTablet): Observable<IDeviceTablet> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/tablet/updateTabletDevice?tabletId=' + deviceTab.tabletId + '&leftDevice=' + deviceTab.deviceIds[0] + '&rightDevice=' + deviceTab.deviceIds[1] + '';

        return this.http.put<IDeviceTablet>(url, deviceTab, httpOptions);

    }

    public getDeviceDetails(leftDeviceMacddress: string): Observable<IDeviceDetails> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        let url: string = environment.apiGatewayUrl + '/device/deviceDetails?leftDeviceMacAddress=' + leftDeviceMacddress;

        return this.http.get<IDeviceDetails>(url, httpOptions);
    }
}
