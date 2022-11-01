import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';

import { LoginComponent } from './login.component';
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
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
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
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from "@angular/core";
import { NotificationService } from '../../../assets/services/notification.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AlreadyloginalertComponent } from '../alreadyloginalert/alreadyloginalert.component';
import { RegisterComponent } from '../register/register.component';
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
    device: "pc",
    role: "[BASIC]",
    expiryDays: 1,
    roleName: "Basic"
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

  public logOutAll(username: string, password: string, device: string): Observable<IUser> {
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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let loginComponent: LoginComponent;
  let userService: UserService;
  let fixture: ComponentFixture<LoginComponent>;

  let userEmail: HTMLInputElement;
  let userPassword: HTMLInputElement;
  let loginBtn: HTMLButtonElement;

  let translate: TranslateService;
  let injector: Injector;
  let shareDataServicespy: jasmine.SpyObj<ShareDataService>;

  it('true is true', () => expect(true).toBe(true));

  const MockElementRef: any = {
    get offsetLeft() {
      return 0;
    }
  };

  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'setApplicationVariables']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent, AlreadyloginalertComponent, RegisterComponent],
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
        RouterModule.forRoot([{
          path: 'alreadyloginalert',
          component: AlreadyloginalertComponent,
          data: {
            title: 'Login'
          },
          pathMatch: 'full'
        },
        {
          path: 'register',
          component: RegisterComponent,
          data: {
            title: 'User Registration'
          },
          pathMatch: 'full'
        },
        {
          path: 'admin/activitymonitoring',
          component: RegisterComponent,
          data: {
            title: 'Active monitoring'
          },
          pathMatch: 'full'
        }]),
        Ng4LoadingSpinnerModule.forRoot(),
        //   RouterTestingModule.withRoutes([{
        //     path: 'alreadyloginalert',
        //     component: AlreadyloginalertComponent,
        //     data: {
        //         title: 'Login'
        //     },
        //     pathMatch: 'full'
        // }]),
        BrowserAnimationsModule,
        // NotifierModule.withConfig({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        LoginComponent,
        //{ provide: UserService, useValue: mockService },
        { provide: UserService, useClass: MocUserService },
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: shareDataServicespy }
        
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);

    component = TestBed.get(LoginComponent);
    userService = TestBed.get(UserService);

    // const mockService = jasmine.createSpyObj('UserService', ['loginUser']);
    // loginUserSpy = mockService.loginUser.and.returnValue(of(mockResponseWarning));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    const router = injector.get(Router);

    // router.navigate(['/'])
    //     .then(() => {
    //       expect(router.url).toEqual('/');
    //     });


    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(loginComponent).toBeDefined();
  });

  it('should #filteredOptions defined after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.filteredOptions).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it(`button should disable when form is invalid `, async(() => {
    let submitEL: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(submitEL.nativeElement.disabled).toBeTruthy;
  }));

  it('#onSubmit()', () => {
    loginComponent.emailFilter("test.abc@example.com");
    loginComponent.loginForm.controls["email"].setValue("test.abc@example.com");

    expect(loginComponent.selectedUser[0].id).toEqual("1");
    expect(loginComponent.selectedUser[0].email).toEqual("test.abc@example.com");
    expect(loginComponent.selectedUser[0].role).toEqual("[BASIC]");
    loginComponent.focusOut(false);

    loginComponent.loginForm.controls["passcode1"].setValue("1");
    loginComponent.loginForm.controls["passcode2"].setValue("2");
    loginComponent.loginForm.controls["passcode3"].setValue("3");
    loginComponent.loginForm.controls["passcode4"].setValue("4");
    loginComponent.onSubmit();

    // loginComponent.formatDate(new Date())
  });

  it(`should call the getLocation method`, () => {
    component.getLocation();
    expect(component.getLocation).toBeTruthy();
  });
 

  it(`should call the navigateRegister method`, () => {
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    loginComponent.isForgotPassword = false;
    loginComponent.cancel ();
    loginComponent.selectedUser = [{ loggedIn: true, id: '1' }];
    userService.deleteUser([parseInt(this.selectedUser)]).subscribe(
      (res:any) => {
        res[status = '200'] ;
        loginComponent.navigateRegister();
      },
    );
  });
  
  it(`should call the loginUser method from userService`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'loginUser');
      let component = fixture.componentInstance;
      component.onSubmit();
      expect(userService.loginUser).toHaveBeenCalled();
    }));
  }));


  it('#formatDate()', () => {
    // loginComponent.formatDate(new Date())

    loginComponent.navigateRegister();

    loginComponent.cancel();
    loginComponent.setAlreadyLoginControls();
    loginComponent.defaultControls();
    loginComponent.clearPasscodes();
  });

  it('#focusOut()', () => {
    loginComponent.emailFilter("test.abc@example.com");
    loginComponent.loginForm.controls["email"].setValue("");

    loginComponent.focusOut(false);
    loginComponent.forgotPassword();

    loginComponent.loginForm.controls["email"].setValue("test.abc@example.com");
    loginComponent.focusOut(false);

    loginComponent.loginForm.controls["email"].setValue("");
    loginComponent.focusOut(true);

    loginComponent.loginForm.controls["email"].setValue("abc@test");
    loginComponent.focusOut(true);

    loginComponent.loginForm.controls["email"].setValue("abc");
    loginComponent.focusOut(false);
  });

  it('#nextFocus()', () => {
    loginComponent.loginForm.controls["passcode1"].setValue("1");
    loginComponent.loginForm.controls["passcode2"].setValue("2");
    loginComponent.loginForm.controls["passcode3"].setValue("3");
    loginComponent.loginForm.controls["passcode4"].setValue("4");
    
    loginComponent.nextFocus("2", { key: "keypress" });
    loginComponent.nextFocus("3", { key: "keypress" });
    loginComponent.nextFocus("4", { key: "keypress" });
    
    loginComponent.nextFocus("5", { key: "Backspace" });
    loginComponent.nextFocus("4", { key: "Backspace" });
    loginComponent.nextFocus("3", { key: "Backspace" });
  });

  it('#forgotPassword ()', () => {
    loginComponent.loginForm.controls["email"].setValue("test.abc@example.com");
    loginComponent.focusOut(false);
    loginComponent.forgotPassword();
  });
  
  it('#autofill()', () => {
    loginComponent.loginForm.controls["email"].setValue("test.abc@example.com");
    loginComponent.autofill("test.abc@example.com");
  });

});
