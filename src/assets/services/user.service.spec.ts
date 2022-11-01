import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from "./user.service";
import { environment } from '../../environments/environment';
import { IResponse } from '../interfaces/iresponse';
import { IUser } from '../interfaces/iuser';
import { ShareDataService } from '../../assets/services/share-data.service';

describe("UserService", () => {
    let injector: TestBed;
    let service: UserService;
    let httpMock: HttpTestingController;
    // let sharedataservicespy: jasmine.createSpy(ShareDataService);

    beforeEach(() => {
        const sharedataservicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService,
            {provide: ShareDataService, useValue:sharedataservicespy}
        ]
        });

        injector = getTestBed();
        service = injector.get(UserService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('#getUsers() should return an Observable<IUser[]>', () => {
        const searchString = "test";
        const dummyUsers = [{ id: '1' }];

        service.getUsers(searchString).subscribe(users => {
            expect(users.length).toBe(1);
            expect(users).toEqual(dummyUsers);
        })

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/user?searchString=' + searchString);
        expect(req.request.method).toBe("GET");
        req.flush(dummyUsers);
    });

    it('#loginUser() should return an Observable<IUser>', () => {
        const dummyUser = {email: 'test@test.com', password: 'password'};
        
        service.loginUser(dummyUser).subscribe(user => {
            expect(user).toEqual(dummyUser);
        })

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/user/login');
        expect(req.request.method).toBe("POST");
        req.flush(dummyUser);
    });

    it('#registerUser() should return an Observable<IUser>', () => {
        const dummyUser = {email: 'test@test.com', password: 'password'};
        
        service.registerUser(dummyUser).subscribe(user => {
            expect(user).toEqual(dummyUser);
        })

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/user/register');
        expect(req.request.method).toBe("POST");
        req.flush(dummyUser);
    });

    it('#deleteUser() should return an Observable<IUser>', () => {
        const dummyUser = {email: 'test@test.com', password: 'password'};
        const id = [1];
        // const rev = 'test-rev';
        let userList: IUser[] = [];
        let mockResponse: IResponse = {
            "status": 200,
            "data": userList
          };
        
        service.deleteUser(id).subscribe(user => {
            expect(user).toEqual(dummyUser);            
        })

        const req = httpMock.expectOne(environment.apiGatewayUrl + '/user/delete/');
        expect(req.request.method).toBe("POST");
        req.flush(dummyUser);
    });

    // it('#logOutUser() should return an Observable<IUser>', () => {
    //     const dummyUser = {"id":1};
    //     const id = "1";
    //     // const rev = 'test-rev';
    //     let userList: IUser[] = [];
    //     let mockResponse: IResponse = {
    //         "status": 200,
    //         "data": userList
    //       };
        
    //     service.deleteUser(id).subscribe(user => {
    //         // expect(user).toEqual(dummyUser);            
    //         console.log("dddddddddddddddddddd: "+JSON.stringify(user))
    //     })

    //     const req = httpMock.expectOne(environment.apiGatewayUrl + '/user/logout');
    //     expect(req.request.method).toBe("POST");
    //     req.flush(dummyUser);
    // });
});
