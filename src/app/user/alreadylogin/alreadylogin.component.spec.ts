import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { AlreadyloginComponent } from './alreadylogin.component';
import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule
} from '@angular/material';
import {
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatSortModule
} from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
// import { NotifierModule } from 'angular-notifier';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../../assets/services/user.service';
import { LocationService } from '../../../assets/services/location.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { IResponse } from '../../../assets/interfaces/iresponse';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from "@angular/core";
import { NotificationService } from '../../../assets/services/notification.service';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import * as $ from 'jquery';

export interface mocLoginResponse {
  access_token?: string,
  refresh_token?: string
}

export class MocUserService {
  user: IUser = {
    id: "1",
    email: "test.abc@example.com",
    password: "abc",
    firstName: "abc",
    lastName: "xyz",
    loggedIn: true,
    loggedInDevice: "pc",
    expiryTimestamp: null,
    creationTimestamp: null,
    _rev: "1",
    device: "pc",
    roleName: "BASIC"
  };

  loginResponse: mocLoginResponse = {
    access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXbklmZFRYVElyX21wcDVGMU9lMVhKa1gyMWpFYnlGSm1mUEF3ckZXY19ZIn0.eyJqdGkiOiIxZDlhNmVhOS0xY2Q0LTRlMDAtODhiNi0wMDJlYWVkMGM2M2QiLCJleHAiOjE1NzA2MDYwNzYsIm5iZiI6MCwiaWF0IjoxNTcwNjA1Nzc2LCJpc3MiOiJodHRwOi8vMTY0LjE2NC4yNy4xNTQ6ODA4MC9hdXRoL3JlYWxtcy9PYXV0aFRva2VuIiwiYXVkIjpbImFjdGl2ZW1vbml0b3JpbmdzZXJ2aWNlIiwiYWNjb3VudCJdLCJzdWIiOiIyYTBiNzRiNS1iZjMyLTQ0NDMtYTdmNy04ZjA1ODhmMmQ3MzEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjdXJsMSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6Ijc5YTcxMmVhLWMyYzQtNGY0OS1iY2QzLWFlYzdjMzI1Y2VlOSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjdGl2ZW1vbml0b3JpbmdzZXJ2aWNlIjp7InJvbGVzIjpbIkJBU0lDIiwiYWR2YW5jZSIsIkFEVkFOQ0VEIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJzdHJpbmcgc3RyaW5nIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmFrZXNoIiwiZ2l2ZW5fbmFtZSI6InN0cmluZyIsImZhbWlseV9uYW1lIjoic3RyaW5nIiwiZW1haWwiOiJyYWtlc2hAaXRuZWVyLm5ldCJ9.f1TeTO-0LVPTKxs0tFWNYMkPMsK4pR7tK33cVNqXbGQJKCnp6DY00hQywyhW-smyih_VpShseQmu5BIMuIfn_BvyYhjenKMnnrANk4bncGVKWVSiJSGSEWWJiDEq7IyDxv3f1SkEwO2BQgI5xFhZA4e7A0eE3Oh4lha25_HiK1-_6plgn0TNjjMGfSPtn8geTF80zLibj49lCQK0mRL-LdYQMGy5NSJVN1shM7DHgafGLwZI3lJVFbHGzc2CItS01f7DZ7oEkqRzW0k0WhVp0h-S6sv2nd1c8EaGkD5rsTNCxw0f5viVTllkFrgNclv3bef3mYUkhdZz5x2YpUpKlw",
    refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzZmZlOTZmYy0yYTcwLTQ2ZWYtODJkYS1kYzk4ZmJlMTNmNDUifQ.eyJqdGkiOiI3ZThjNzNhNi1hYjBmLTRkNDktYTUyMS05YzRlZWZiNWY0YTQiLCJleHAiOjE1NzA0NTE0OTYsIm5iZiI6MCwiaWF0IjoxNTcwNDQ5Njk2LCJpc3MiOiJodHRwOi8vMTY0LjE2NC4yNy4xMTU6ODE4MC9hdXRoL3JlYWxtcy9oZXh3YXZlIiwiYXVkIjoiaHR0cDovLzE2NC4xNjQuMjcuMTE1OjgxODAvYXV0aC9yZWFsbXMvaGV4d2F2ZSIsInN1YiI6ImZmOGExZDU4LWQ5OTgtNGM4MS05YzhlLTQxMTdkMWNhZTQwZiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhY3RpdmUtbW9uaXRvcmluZy1zZXJ2aWNlIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNjg1YTE0ZTUtY2IzMy00NGFiLTk3YTUtM2IzOTFhOTljYmVhIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJVU0VSIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWN0aXZlLW1vbml0b3Jpbmctc2VydmljZSI6eyJyb2xlcyI6WyJVU0VSIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUifQ.NDto161XzFV2_IDBByqdhJONWyPiYVP68RLcmbo5lvI"
  }

  userList: IUser[] = [];

  public getUsers(search: string): Observable<IResponse> {
    this.userList.push(this.user);

    let mockResponse: IResponse = {
      "status": 200,
      "data": this.userList
    };
    return of(mockResponse);
  }

  public loginUser(user: IUser): Observable<mocLoginResponse> {
    // return of(this.user);
    // this.userList.push(this.user);

    // let mockResponse: IResponse = {
    //     "status": 200,
    //     "data": this.userList
    //   };

    return of(this.loginResponse);
  }

  public registerUser(user: IUser): Observable<IUser> {
    return of(this.user);
  }

  public deleteUser(id: string, rev: string): Observable<IUser> {
    return of(this.user);
  }

  public logOutAll(username: string, password: string, device: string): Observable<IUser> {
    return of(this.user);
  }
}

export class mocAuthenticationService {
  user: IUser = {
    id: "1",
    email: "test.abc@example.com",
    password: "abc",
    firstName: "abc",
    lastName: "xyz",
    loggedIn: true,
    loggedInDevice: "pc",
    expiryTimestamp: null,
    creationTimestamp: null,
    _rev: "1",
    device: "pc",
    roleName: "BASIC"
  };

  constructor(private http: HttpClient) {
  }

  public login(username: string, password: string): Observable<IUser> {
    return of(this.user);
  }

  public verifyToken(): Observable<IUser> {
    return of(this.user);
  }

  logout(): Observable<IUser> {
    return of(this.user);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('AlreadyloginComponent', () => {
  let component: AlreadyloginComponent;
  let fixture: ComponentFixture<AlreadyloginComponent>;
  let userService: UserService;
  let loginUserSpy: any;
  const formBuilder: FormBuilder = new FormBuilder();
  let shareDataServicespy: jasmine.SpyObj<ShareDataService>;

  const mockUser: IUser = {
    id: "1",
    email: "test.abc@example.com",
    password: "abc",
    firstName: "abc",
    lastName: "xyz",
    loggedIn: true,
    loggedInDevice: "pc",
    expiryTimestamp: null,
    creationTimestamp: null,
    _rev: "1",
    device: "pc",
    roleName: "BASIC"
  };

  let mockUserList: IUser[] = [];
  mockUserList.push(mockUser);

  const mockResponse: IResponse = {
    "status": 200,
    "data": mockUserList
  };

  let translate: TranslateService;
  let injector: Injector;

  it('true is true', () => expect(true).toBe(true));

  const MockElementRef: any = {
    get offsetLeft() {
      return 0;
    }
  };

  beforeEach(async(() => {
    // const mockService = jasmine.createSpyObj('UserService', ['loginUser']);
    //loginUserSpy = mockService.loginUser.and.returnValue(of(mockResponse));
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showNotification']);
    shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'setApplicationVariables']);

    TestBed.configureTestingModule({
      declarations: [AlreadyloginComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
        FormsModule, ReactiveFormsModule,
        RouterModule.forRoot([]),
        BrowserAnimationsModule,
        // NotifierModule.withConfig({}),
        // TranslateModule.forRoot({
        //   loader:{
        //     provide:TranslateLoader,            
        //     useClass: FakeLoader          
        //   }
        // })
        HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        Ng4LoadingSpinnerModule.forRoot()
      ],
      providers: [
        AlreadyloginComponent,
        // { provide: UserService, useValue: mockService }, 
        { provide: UserService, useClass: MocUserService },
        // { provide: locationService, useClass: LocationService },
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: NotificationService, notificationServiceSpy },
        { provide: ShareDataService, useValue: shareDataServicespy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);

    // component = TestBed.get(AlreadyloginComponent);
    // userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call the getLocation method`, () => {
    component.getLocation();
    expect(component.getLocation).toBeTruthy();
  });

  it('#onSubmit()', () => {
    component.loginForm.controls["email"].setValue("test.abc@example.com");
    component.loginForm.controls["passcode1"].setValue("1");
    component.loginForm.controls["passcode2"].setValue("2");
    component.loginForm.controls["passcode3"].setValue("3");
    component.loginForm.controls["passcode4"].setValue("4");

    component.onSubmit();
    component.cancel();
    component.clearPasscodes();

   component.nextFocus("2", { key: "keypress" });
   component.nextFocus("3", { key: "keypress" });
   component.nextFocus("4", { key: "keypress" });  
   component.nextFocus("5", { key: "Backspace" });
   component.nextFocus("4", { key: "Backspace" });
   component.nextFocus("3", { key: "Backspace" });
  });
});