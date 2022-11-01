import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

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
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from "../../../assets/services/user.service";
import { IUser } from '../../../assets/interfaces/iuser';
import { Observable, of } from 'rxjs';
// import { NotifierService } from 'angular-notifier';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { NotifierModule } from 'angular-notifier';
import { FormBuilder } from '@angular/forms';
import { IResponse } from '../../../assets/interfaces/iresponse';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from "@angular/core";
import { NotificationService } from '../../../assets/services/notification.service';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let registerComponent: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  const formBuilder: FormBuilder = new FormBuilder();
  let loginUserSpy: any;
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
    device: "pc"
  };

  let mockUserList: IUser[] = [];
  mockUserList.push(this.user);

  const mockResponse: IResponse = {
    "status": 200,
    "data": mockUserList
  };

  let translate: TranslateService;
  let injector: Injector;

  it('true is true', () => expect(true).toBe(true));

  // const mockService = jasmine.createSpyObj('UserService', ['getUsers']);
  // loginUserSpy = mockService.loginUser.and.returnValue(of(mockResponse));
  const MockElementRef: any = {
    get offsetLeft() {
      return 0;
    }
  };

  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'setApplicationVariables']);
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
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
        FormsModule, ReactiveFormsModule, HttpClientModule,
        RouterModule.forRoot([]),
        BrowserAnimationsModule,
        Ng4LoadingSpinnerModule.forRoot(),
        // NotifierModule.withConfig({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        RegisterComponent,
        { provide: UserService, useClass: MocUserService },
        // { provide: UserService, useValue: mockService }, 
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: shareDataServicespy },
        DatePipe
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);

    component = TestBed.get(RegisterComponent);
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    registerComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(registerComponent).toBeDefined();
  });

  // it('Angular calls ngOnInit', () => {
  //   component.ngOnInit();    
  // });

  it('should create', () => {
    expect(registerComponent).toBeTruthy();
  });

  it(`button should disable when form is invalid `, () => {
    let submitEL: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(submitEL.nativeElement.disabled).toBeTruthy;
  });

  // it(`should call the navigateLogin method`, () => {
  //     let button =fixture.debugElement.nativeElement.querySelector(By.css('.label_link'));
  //     button.click();
  //     registerComponent.navigateLogin ();
  //   });

  it(`should call the registerUser method from userService`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'registerUser');
      let component = fixture.componentInstance;
      component.onSubmit();
      expect(userService.registerUser).toHaveBeenCalled();
    }));
  }));

  it(`should call the getLocation method`, () => {
    component.getLocation();
    expect(component.getLocation).toBeTruthy();
  });

  it(`should call the login method`, () => {
    component.login();
    expect(component.login).toBeTruthy();
  });


  it(`should set submitted to be true`, (() => {
    component.onSubmit();
    expect(component.onSubmit).toBeTruthy();
  }));

  it(`form should be invalid`, async(() => {
    registerComponent.registerForm.controls["firstName"].setValue('');
    registerComponent.registerForm.controls["lastName"].setValue('');
    registerComponent.registerForm.controls["email"].setValue('');
    registerComponent.registerForm.controls["confirmEmail"].setValue('');

    registerComponent.registerForm.controls["passcode1"].setValue('');
    registerComponent.registerForm.controls["passcode2"].setValue('');
    registerComponent.registerForm.controls["passcode3"].setValue('');
    registerComponent.registerForm.controls["passcode4"].setValue('');

    registerComponent.registerForm.controls["confPasscode1"].setValue('');
    registerComponent.registerForm.controls["confPasscode2"].setValue('');
    registerComponent.registerForm.controls["confPasscode3"].setValue('');
    registerComponent.registerForm.controls["confPasscode4"].setValue('');
    expect(registerComponent.registerForm.valid).toBeFalsy();
  }));


  it('#onSubmit()', () => {
    registerComponent.registerForm.controls["firstName"].setValue("test");
    registerComponent.registerForm.controls["lastName"].setValue("abc");

    registerComponent.registerForm.controls["confirmEmail"].setValue("test.abc@example.com");
    registerComponent.registerForm.controls["confPasscode1"].setValue("1");
    registerComponent.registerForm.controls["confPasscode2"].setValue("2");
    registerComponent.registerForm.controls["confPasscode3"].setValue("3");
    registerComponent.registerForm.controls["confPasscode4"].setValue("4");
    registerComponent.onSubmit();

    registerComponent.focusOut("email");

    registerComponent.registerForm.controls["passcode1"].setValue("1");
    registerComponent.registerForm.controls["passcode2"].setValue("2");
    registerComponent.registerForm.controls["passcode3"].setValue("3");
    registerComponent.registerForm.controls["passcode4"].setValue("3");

    registerComponent.registerForm.controls["email"].setValue("test.abc@example.com");
    registerComponent.focusOut("passcode");

    //Confirm passcode is blank
    registerComponent.registerForm.controls["confPasscode1"].setValue("");
    registerComponent.registerForm.controls["confPasscode2"].setValue("");
    registerComponent.registerForm.controls["confPasscode3"].setValue("");
    registerComponent.registerForm.controls["confPasscode4"].setValue("");
    registerComponent.focusOut("passcode");
    registerComponent.passcodeTickWrongShowHide(false, false);

    //Passcode and confirm passcodes are same
    registerComponent.registerForm.controls["confPasscode1"].setValue("1");
    registerComponent.registerForm.controls["confPasscode2"].setValue("2");
    registerComponent.registerForm.controls["confPasscode3"].setValue("3");
    registerComponent.registerForm.controls["confPasscode4"].setValue("4");
    registerComponent.focusOut("passcode");

    registerComponent.nextFocus("2", { key: "keypress" });
    registerComponent.nextFocus("3", { key: "keypress" });
    registerComponent.nextFocus("4", { key: "keypress" });
    registerComponent.nextFocus("5", { key: "keypress" });
    registerComponent.nextFocus("6", { key: "keypress" });
    registerComponent.nextFocus("7", { key: "keypress" });

    registerComponent.nextFocus("8", { key: "Backspace" });
    registerComponent.nextFocus("7", { key: "Backspace" });
    registerComponent.nextFocus("6", { key: "Backspace" });

    registerComponent.navigateLogin();
    registerComponent.formatDate(new Date());
    registerComponent.clearControls();
    registerComponent.validateFields();
    registerComponent.updateProgress();
  });
});
