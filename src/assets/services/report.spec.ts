import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { environment } from '../../environments/environment';
import { IResponse } from '../interfaces/iresponse';
import { IUser } from '../interfaces/iuser';
import { IDevice } from '../interfaces/IDevice';
import { IWeaponDetected } from '../interfaces/ireports';
import { ShareDataService } from '../services/share-data.service';
import { CommonFunctions } from '../common/common-functions';

describe("ReportService", () => {
    let injector: TestBed;
    let service: ReportService;
    let httpMock: HttpTestingController;
    let shareDataServicespy: jasmine.SpyObj<ShareDataService>;
    

    beforeEach(() => {
        shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables',]);
        shareDataServicespy.locale="-05:00";

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ReportService, CommonFunctions,
                { provide: ShareDataService, useValue: shareDataServicespy },
                
            ]
        });

        injector = getTestBed();
        service = injector.get(ReportService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('#getThroughput(startDate: number, endDate: number) should return an Observable<IThroughput[]>', () => {
        const startDate: number = 1574232126000;
        const endDate: number = 1574233205000;
        const dummyLocations = [{ date: 1574232126000, hour: 10, total: 1 }];

        service.getThroughput(startDate, endDate).subscribe(throughput => {
            expect(throughput.length).toBe(1);
            expect(throughput[0].total).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/report/throughput?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent("-05:00"));
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getThreatActivity(startDate: string, endDate: string) should return an Observable<IThreatActivity[]>', () => {
        const startDate: number = 1574232126000;
        const endDate: number = 1574233205000;
        const dummyLocations = [{ id: 1, creationTimestamp: 1574232126000 }];

        service.getThreatActivity(startDate, endDate).subscribe(throughput => {
            expect(throughput.length).toBe(1);
            expect(throughput[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/report/threat-activity?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent("-05:00"));
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getWeaponDetected(startDate: string, endDate: string) should return an Observable<IThroughput[]>', () => {
        const startDate: number = 1574232126000;
        const endDate: number = 1574233205000;
        const dummyLocations: IWeaponDetected = { handgun: 1, rifle: 1 }; //{ id: 1, val: 'test-01', handgun: 'left scapula'};

        service.getWeaponDetected(startDate, endDate).subscribe(throughput => {
            expect(throughput.handgun).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/report/weapons-detected?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent("-05:00"));
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getDatewise(startDate: string, endDate: string) should return an Observable<IThroughput[]>', () => {
        const startDate: number = 1574232126000;
        const endDate: number = 1574233205000;
        const dummyLocations: IWeaponDetected[] = [{ handgun: 1, rifle: 1 }]; //{ id: 1, val: 'test-01', handgun: 'left scapula'};

        service.getDatewise(startDate, endDate).subscribe(throughput => {
            expect(throughput[0].handgun).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/report/weapons-detected/date-wise?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent("-05:00"));
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getPositionwise(startDate: string, endDate: string) should return an Observable<IThroughput[]>', () => {
        const startDate: number = 1574232126000;
        const endDate: number = 1574233205000;
        const dummyLocations: IWeaponDetected[] = [{ handgun: 1, rifle: 1 }]; //{ id: 1, val: 'test-01', handgun: 'left scapula'};

        service.getPositionwise(startDate, endDate).subscribe(throughput => {
            expect(throughput[0].handgun).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/report/weapons-detected/position-wise?startDate=' + startDate + "&endDate=" + endDate + "&locale=" + encodeURIComponent("-05:00"));
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });
});
