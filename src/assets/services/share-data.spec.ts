import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ShareDataService } from "./share-data.service";


describe("ShareDataService", () => {
    let injector: TestBed;
    let service: ShareDataService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ShareDataService]
        });

        injector = getTestBed();
        service = injector.get(ShareDataService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });
    it('should be created', () => {
        const service: ShareDataService = TestBed.get(ShareDataService);
        expect(service).toBeTruthy();
    });

    it('should return sharedData', () => {
        // service.getSharedData();
        expect(service.getSharedData).toHaveBeenCalled;

    });

    it('should return clearSessionVariables', () => {
        service.clearSessionVariables();
        expect(service.clearSessionVariables).toHaveBeenCalled;

        service.setSharedData("test");
        expect(service.getSharedData()).toEqual("test");
    });

    it('#setApplicationVariables()', () => {
        service.setApplicationVariables();
        expect(service.setApplicationVariables).toHaveBeenCalled;
    });

});