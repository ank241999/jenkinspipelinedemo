import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { RouterModule, Routes } from '@angular/router';
import { DeviceSetupPageComponent } from './devicesetup.component';
// import { UserRoutingModule } from './user-routing.module';
// import { NotifierModule } from 'angular-notifier';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { AlreadyloginalertComponent } from './alreadyloginalert/alreadyloginalert.component';
// import { AlreadyloginComponent } from './alreadylogin/alreadylogin.component';
// import { RegisteragainComponent } from './registeragain/registeragain.component';

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
import { LaneDeviceService } from '../../../assets/services/lanedevice.service';
import { EntranceService } from '../../../assets/services/entrance.service'
import { IUser } from '../../../assets/interfaces/iuser';
import { IResponse, ILocationResponse, IDeviceResponse } from '../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { IDevice } from '../../../assets/interfaces/IDevice';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export class MocLaneDeviceService {
  location: ILocation = {
    id: 1,
    creationTimestamp: null,
    updateTimestamp: null,
    name: "Basic",
    customer: {
      id: 1,
      creationTimestamp: null,
      updateTimestamp: null,
      name: "Basic",
      email: "abc@example.com"
    }
  };

  locationList: ILocation[] = [];

  device: IDevice={
    id: 1,
    laneName: "Test Lane",
    name: "Test Device",
    side: "Left",
    macAddress: "16416427209",
    status: true,
    tabletId: "1"
  }

  devicList: IDevice[]=[];

  public getLocation(customerId: number): Observable<ILocation[]> {
    this.locationList.push(this.location);
    return of(this.locationList);
  }

  public getEntrances(customerId: number): Observable<ILocationResponse> {
    this.locationList.push(this.location);

    let mockResponse: ILocationResponse = {
      "status": 200,
      "data": this.locationList
    };
    return of(mockResponse);
  }

  public getDevice(deviceID: number): Observable<IDeviceResponse> {
    this.devicList.push(this.device);

    let mockResponse: IDeviceResponse = {
      "status": 200,
      "data": this.devicList
    };
    return of(mockResponse);
  }

  public getAllGateDevices(entranceID: number): Observable<IDeviceResponse> {
    this.devicList.push(this.device);

    let mockResponse: IDeviceResponse = {
      "status": 200,
      "data": this.devicList
    };
    return of(mockResponse);
  }

  public putDevice( device: IDevice): Observable<IDevice> {
    return of(this.device);
  }
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('DeviceSetupPageComponent', () => {
  let component: DeviceSetupPageComponent;
  let fixture: ComponentFixture<DeviceSetupPageComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'devicesetup',
      component: DeviceSetupPageComponent,
      data: {
        title: 'Add users'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);

    TestBed.configureTestingModule({
      declarations: [DeviceSetupPageComponent],
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
        MatButtonToggleModule,
        MatProgressBarModule,
        HttpClientModule,
        //RouterModule.forChild(routes),
        RouterModule.forRoot(routes, { useHash: true }),
        // UserRoutingModule,NotifierModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      //providers:[{provide: MessagingService,useClass: mockMessagingService}],
      providers: [
        { provide: LaneDeviceService, useClass: MocLaneDeviceService },
        { provide: NotificationService, notificationService },
        DatePipe
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('component should be defined', () => {
  //   let locations: ILocation[] = [{
  //     id: 1,
  //     creationTimestamp: null,
  //     updateTimestamp: null,
  //     name: "Basic",
  //     customer: {
  //       id: 1,
  //       creationTimestamp: null,
  //       updateTimestamp: null,
  //       name: "Basic",
  //       email: "abc@example.com"
  //     }
  //   }];
  //   expect(component.locations).toEqual(locations);
  //   expect(component).toBeDefined();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('#validateFields()', () => {
  //   component.validateFields();
  // });

  // it('#updateProgress()', () => {
  //   component.updateProgress();
  // });

  // it('#onSubmit()', () => {
  //   component.form.controls["firstName"].setValue("test");
  //   component.form.controls["lastName"].setValue("test");
  //   component.form.controls["confirmPassword1"].setValue("test");
  //   component.form.controls["confirmPassword2"].setValue("test");
  //   component.form.controls["confirmPassword3"].setValue("test");
  //   component.form.controls["confirmPassword4"].setValue("test");
  //   component.form.controls["email"].setValue("test");
  //   component.form.controls["role"].setValue("1");
  //   component.form.controls["expiryDays"].setValue(1);

  //   // component.onSubmit();

  //   component.formatDate(new Date());

  //   component.form.controls["password1"].setValue("test");
  //   component.form.controls["password2"].setValue("test");
  //   component.form.controls["password3"].setValue("test");
  //   component.form.controls["password4"].setValue("test");
  //   component.comparePassword();

  //   component.changeRole(1);
  //   component.changeRole(2);

  //   component.nextFocus("1");
  //   component.nextFocus("2");
  //   component.nextFocus("3");
  //   component.nextFocus("4");
  //   component.nextFocus("5");
  //   component.nextFocus("6");
  //   component.nextFocus("7");
  //   component.nextFocus("8");
  // });
});
