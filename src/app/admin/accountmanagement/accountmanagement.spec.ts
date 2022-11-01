import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';

import { RouterModule, Routes } from '@angular/router';
import { AccountManagementComponent } from './accountmanagement.component';
// import { UserRoutingModule } from './user-routing.module';
// import { NotifierModule } from 'angular-notifier';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { AlreadyloginalertComponent } from './alreadyloginalert/alreadyloginalert.component';
// import { AlreadyloginComponent } from './alreadylogin/alreadylogin.component';
// import { RegisteragainComponent } from './registeragain/registeragain.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatSortModule, MatRowDef
} from '@angular/material';
import { UserService } from "../../../assets/services/user.service";
import { IUser } from '../../../assets/interfaces/iuser';
import { IResponse } from '../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';


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

describe('AccountManagementComponent', () => {
  let component: AccountManagementComponent;
  let fixture: ComponentFixture<AccountManagementComponent>;
  let injector: Injector;
  let translate: TranslateService;
  const routes: Routes = [
    {
      path: 'accountmanagement',
      component: AccountManagementComponent,
      data: {
        title: 'Users'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [AccountManagementComponent],
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
        //RouterModule.forChild(routes),
        RouterModule.forRoot(routes, { useHash: true }),
        Ng4LoadingSpinnerModule.forRoot(),
        // UserRoutingModule,NotifierModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      //providers:[{provide: MessagingService,useClass: mockMessagingService}],
      providers: [
        { provide: UserService, useClass: MocUserService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: shareDataServicespy}
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    // let injectedService = TestBed.get(ShareDataService);
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call the getUsers from userService on Submit`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'getUsers');
      let component = fixture.componentInstance;
      component.ngOnInit();
      expect(userService.getUsers).toHaveBeenCalled();
    }));
  }));

  it(`should call the deleteUser from userService`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'deleteUser');
      expect(userService.deleteUser).toHaveBeenCalled();
    }));
  }));

  it('should call open Dialog', async() =>  {
  let button = fixture.debugElement.nativeElement.querySelector('button');
     button.click();
     fixture.whenStable().then(() => {
       expect(component.openDialog).toHaveBeenCalled();
     });
}); 


it('should call delete Dialog', async() =>  {
let button = fixture.debugElement.nativeElement.querySelector('button');
   button.click();

fixture.whenStable().then(() => {
     expect(component.deleteAccount).toHaveBeenCalled();
   });
}); 

it(`should call the filterDeployments method`, () => {
  component.filterDeployments();
  expect(component.filterDeployments).toBeTruthy();
});

it(`should call the isAllSelected method`, () => {
  component.isAllSelected();
  expect(component.isAllSelected).toBeTruthy();
});

it(`should call the selectAll method`, () => {
  component.selectAll();
  expect(component.selectAll).toBeTruthy();
});

it(`should call the masterToggle method`, () => {
  component.masterToggle();
  expect(component.masterToggle).toBeTruthy();
});

it(`should call the applyFilter method`, () => {
  component.applyFilter("1");
  expect(component.applyFilter).toBeTruthy();
});

});
