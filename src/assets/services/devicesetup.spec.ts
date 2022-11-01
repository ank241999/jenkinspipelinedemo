import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeviceSetupService } from './devicesetup.service';
import { environment } from '../../environments/environment';
import { IResponse } from '../interfaces/iresponse';
import { IUser } from '../interfaces/iuser';
import { IDevice } from '../interfaces/IDevice';

describe("DeviceSetupService", () => {
    let injector: TestBed;
    let service: DeviceSetupService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DeviceSetupService]
        });

        injector = getTestBed();
        service = injector.get(DeviceSetupService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('#getLocation(id) should return an Observable<ILocation[]>', () => {
        const customerId = 0;
        const dummyLocations = [{ id: 1, val: 'test-01' }];

        service.getLocation(customerId).subscribe(locations => {
            expect(locations.length).toBe(1);
            expect(locations[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/location');
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getLocation(id) should return an Observable<ILocation[]>', () => {
        const customerId = 1;
        const dummyLocations = [{ id: 1, val: 'test-01' }];

        service.getLocation(customerId).subscribe(locations => {
            expect(locations.length).toBe(1);
            expect(locations[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/location?customerId=' + customerId);
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getEntrances(id) should return an Observable<ILocation[]>', () => {
        const locationid = 0;
        const dummyLocations = [{ id: 1, val: 'test-01' }];

        service.getEntrances(locationid).subscribe(locations => {
            expect(locations.length).toBe(1);
            expect(locations[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/entrance');
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#getEntrances(id) should return an Observable<ILocation[]>', () => {
        const locationid = 1;
        const dummyLocations = [{ id: 1, val: 'test-01' }];

        service.getEntrances(locationid).subscribe(locations => {
            expect(locations.length).toBe(1);
            expect(locations[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/entrance?locationId=' + locationid);
        expect(req.request.method).toBe("GET");
        req.flush(dummyLocations);
    });

    it('#putDevice(locationid: number, entranceID: number, deviceID: number) should return an Observable<IDevice[]>', () => {
        const locationid = 1;
        const entranceID = 1;
        const laneName = "TestLane";
        const device: IDevice = {};
        const dummyDevices = [{ id: "1", val: 'test-01' }];

        service.putDevice(locationid, entranceID, "TestLane", device).subscribe(device => {
            // expect(locations.length).toBe(1);
            expect(device[0].id).toEqual("1");
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/device/' + locationid + '/' + entranceID + '/' + laneName);
        expect(req.request.method).toBe("PUT");
        req.flush(dummyDevices);
    });
});
