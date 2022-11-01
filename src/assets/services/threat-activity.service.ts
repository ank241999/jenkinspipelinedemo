import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IActivityMonitoring, OldActivityMonitoring } from '../interfaces/iactivity-monitoring';
import { environment } from '../../environments/environment';

@Injectable()
export class ThreatActivityService {

    constructor(private http: HttpClient) {
    }

    public getThreatActivities(tabletIp: string): Observable<OldActivityMonitoring[]> {
        let url = '/active-monitor/threat-logs';
        if (tabletIp) {
            url = url + '?tabletIp=' + tabletIp;
        }
        // return this.http.get(environment.apiGatewayUrl + '/active-monitor/threat-config') as Observable<IActivityMonitoring[]>;
        return this.http.get(environment.apiGatewayUrl + url) as Observable<OldActivityMonitoring[]>;
    }

    public setThreatViewed(obj: Object): Observable<IActivityMonitoring> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.put<IActivityMonitoring>(environment.apiGatewayUrl + '/active-monitor/update/threat-config', obj, httpOptions);
    }
}
