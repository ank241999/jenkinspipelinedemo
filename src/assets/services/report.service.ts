import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IWeaponDetected, IThroughput, IThreatActivity, IThreatLogReport, IAnalyticReport, IPersonScannedDetails } from '../interfaces/ireports';
import { ShareDataService } from '../services/share-data.service';
import { CommonFunctions } from '../common/common-functions';

@Injectable()
export class ReportService {
    constructor(private http: HttpClient, private shareDataService: ShareDataService, private commonFunctions: CommonFunctions) {
    }

    public getThroughput(startDate: number, endDate: number): Observable<IThroughput[]> {
        let url: string = environment.apiGatewayUrl + '/report/throughput?locale=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate != null && startDate != 0 && endDate != null && endDate != 0) {
            url = environment.apiGatewayUrl + '/report/throughput?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getPersonScannedDetail(startDate: string, endDate: string): Observable<IPersonScannedDetails[]> {
        let url: string = environment.apiGatewayUrl + '/report/person-scanned-details?startDate=' + startDate + '&endDate=' + endDate;

        return this.commonFunctions.httpGetList(url);
    }

    public getThreatActivity(startDate: number, endDate: number): Observable<IThreatActivity[]> {
        let url: string = environment.apiGatewayUrl + '/report/threat-activity';
        if (startDate != null && startDate != 0 && endDate != null && endDate != 0) {
            url = environment.apiGatewayUrl + '/report/threat-activity?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getWeaponDetected(startDate: number, endDate: number): Observable<IWeaponDetected> {
        let url: string = environment.apiGatewayUrl + '/report/weapons-detected';
        if (startDate != null && startDate != 0 && endDate != null && endDate != 0) {
            url = environment.apiGatewayUrl + '/report/weapons-detected?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGet(url);
    }

    public getDatewise(startDate: number, endDate: number): Observable<IWeaponDetected[]> {
        let url: string = environment.apiGatewayUrl + '/report/weapons-detected/date-wise?locale=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate != null && startDate != 0 && endDate != null && endDate != 0) {
            url = environment.apiGatewayUrl + '/report/weapons-detected/date-wise?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getPositionwise(startDate: number, endDate: number): Observable<IWeaponDetected[]> {
        let url: string = environment.apiGatewayUrl + '/report/weapons-detected/position-wise';
        if (startDate != null && startDate != 0 && endDate != null && endDate != 0) {
            url = environment.apiGatewayUrl + '/report/weapons-detected/position-wise?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getThreatLogsReport(startDate: string, endDate: string, pageFrom: number, pageTo: number,
        weaponType: string, threatLocation: string, threatType: string, actualResult: string, incorrectRecordsBy: string): Observable<IThreatLogReport[]> {
        let url: string = environment.apiGatewayUrl + '/threatReport/threatReport?startDate=' + startDate + '&endDate=' + endDate + '&pageFrom=' + pageFrom + '&pageTo=' + pageTo;
        url = url + (weaponType == "" ? "" : '&weaponType=' + weaponType);
        url = url + (threatLocation == "" ? "" : '&threatLocation=' + threatLocation);
        url = url + (threatType == "" ? "" : '&threatType=' + threatType);
        url = url + '&actualResult=' + actualResult + '';
        url = url + '&incorrectRecordsBy=' + incorrectRecordsBy + '';
        return this.commonFunctions.httpGetList(url);
    }

    public getBetaTestModeReportList(startDate: string, endDate: string): Observable<IAnalyticReport[]> {
        let url: string = environment.apiGatewayUrl + '/threatReport/betaTestModeReportList?startDate=' + startDate + "&endDate=" + endDate;
        return this.commonFunctions.httpGetList(url);
    }
}
