import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { RegisteragainComponent } from './registeragain.component';
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Observable, of } from 'rxjs';
// import { NotifierService } from 'angular-notifier';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { NotifierModule } from 'angular-notifier';
import { FormBuilder } from '@angular/forms';
import { IResponse } from '../../../assets/interfaces/iresponse';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Injector} from "@angular/core";
import { NotificationService } from '../../../assets/services/notification.service';

export class MocUserService {
  user: IUser={
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
    device: "pc"
  };  
  
  userList: IUser[] = [];

  public getUsers(search: string): Observable<IResponse> {
    this.userList.push(this.user);

    let mockResponse: IResponse = {
        "status": 200,
        "data": this.userList
      };
    return of(mockResponse);
  }

  public loginUser(user: IUser): Observable<IResponse> {
    // return of(this.user);
    this.userList.push(this.user);

    let mockResponse: IResponse = {
        "status": 200,
        "data": this.userList
      };

    return of(mockResponse);
  }

  public registerUser(user: IUser): Observable<IUser> {
    return of(this.user);
  }

  public deleteUser(id: string, rev: string): Observable<IUser> {
    return of(this.user);
  }
}

export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}

let translations: any = {"CARDS_TITLE": "This is a test"};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('RegisteragainComponent', () => {
  let component: RegisteragainComponent;
  let fixture: ComponentFixture<RegisteragainComponent>;
  let userService: UserService;
  const formBuilder: FormBuilder = new FormBuilder();
  let loginUserSpy: any;

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
    device: "pc"
  };

  let mockUserList: IUser[] = [];
  mockUserList.push(this.user);

  const mockResponse: IResponse = {
    "status": 200,
    "data": mockUserList
  };

  let translate: TranslateService;
  let injector:  Injector;

  it('true is true', () => expect(true).toBe(true));

  // const mockService = jasmine.createSpyObj('UserService', ['getUsers']);
  // loginUserSpy = mockService.loginUser.and.returnValue(of(mockResponse));

  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService',['showNotification']);

    TestBed.configureTestingModule({
      declarations: [ RegisteragainComponent ],
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
        TranslateModule.forRoot({
          loader:{
            provide:TranslateLoader,
            useClass: FakeLoader          
          }
        })
      ],
      providers: [
        RegisteragainComponent,     
        // { provide: UserService, useValue: mockService },   
        { provide: UserService, useClass: MocUserService },   
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: NotificationService, notificationService }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);

    component = TestBed.get(RegisteragainComponent);
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteragainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    component.navigateRegister();
    component.cancel();
  });
});
