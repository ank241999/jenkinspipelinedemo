import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserSettingService } from './userSettingService';
import { environment } from '../../environments/environment';
import { IResponse } from '../interfaces/iresponse';
import { IUserSetting } from '../interfaces/iuser-setting';
import { IDevice } from '../interfaces/IDevice';

describe("UserSettingService", () => {
    let injector: TestBed;
    let service: UserSettingService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserSettingService]
        });

        injector = getTestBed();
        service = injector.get(UserSettingService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('#getUserSetting(id) should return an Observable<ILocation[]>', () => {
        const user: IUserSetting = {};
        const userId = "1";
        const dummyUsers = [{ id: 1, val: 'test-01' }];

        service.getUserSetting(userId).subscribe(userSetting => {
            expect(userSetting[0].id).toEqual(1);
        });

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/api/setting/' + userId );
        expect(req.request.method).toBe("GET");
        req.flush(dummyUsers);
    });    

    // it('#putUserSetting(id) should return an Observable<IUserSetting[]>', () => {
    //     const user: IUserSetting = {};
    //     const userId = "1";
    //     const dummyUsers = { id: 1, val: 'test-01' };

    //     service.putUserSetting(user).subscribe(userSetting => {
    //         // expect(userSetting.length).toBe(1);
    //         expect(userSetting.id).toEqual(1);
    //         console.log("dddddddddddddddddddddddddddddddddddddddddd: "+JSON.stringify(userSetting))
    //     });

    //     const req = httpMock.expectOne(environment.apiGatewayUrl + '/api/setting/'+userId);
    //     expect(req.request.method).toBe("PUT");
    //     req.flush(dummyUsers);
    // });   
});
