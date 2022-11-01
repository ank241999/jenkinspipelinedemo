import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { IDevice } from "../interfaces/idevice";
import { DevicemanagementService } from "./devicemanagement.service";

describe("DevicemanagementService", () => {
    let injector: TestBed;
    let service: DevicemanagementService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DevicemanagementService]
        });

        injector = getTestBed();
        service = injector.get(DevicemanagementService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('#getDevices() should return an Observable<IDevice[]>', () => {
        const dummyDevices = [{ id: 1, val: 'test-01' }];

        service.getDevices().subscribe(devices => {
            expect(devices.length).toBe(1);
            expect(devices[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/device/getAllDevice');
        expect(req.request.method).toBe("GET");
        req.flush(dummyDevices);
    });

    it('#updateDevice(device: IDevice) should return an Observable<ITablet>', () => {
        const device: IDevice = {};
        const dummyDevices = [{ id: "1", val: 'test-01' }];

        service.updateDevice(device).subscribe(device => {
            // expect(locations.length).toBe(1);
            expect(device[0].id).toEqual("1");
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/device');
        expect(req.request.method).toBe("PUT");
        req.flush(dummyDevices);
    });
});
