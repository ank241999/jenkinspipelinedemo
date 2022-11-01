import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ThreatActivityService } from "./threat-activity.service";
import { environment } from '../../environments/environment';

describe("ThreatActivityService", () => {

    let injector: TestBed;
    let service: ThreatActivityService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ThreatActivityService]
        });

        injector = getTestBed();
        service = injector.get(ThreatActivityService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('#getThreatActivities() should return an Observable<IActivityMonitoring[]>', () => {
        const dummyData = [{ id: 'test-01' }];

        service.getThreatActivities().subscribe(data => {
            expect(data.length).toBe(1);
            expect(data).toEqual(dummyData);
        })

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/active-monitor/threat-logs');
        expect(req.request.method).toBe("GET");
        req.flush(dummyData);
    });
});
