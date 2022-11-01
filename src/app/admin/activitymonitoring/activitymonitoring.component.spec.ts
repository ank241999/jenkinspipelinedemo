import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { ActivityThreatsComponent } from '../activitymonitoring/activitythreats.component';

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
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { Observable, of } from 'rxjs';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagingService } from '../../../assets/services/messaging.service';
import { BehaviorSubject } from "rxjs";
import { Message } from "@stomp/stompjs";
import { StompState } from "@stomp/ng2-stompjs";
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, asNativeElements } from '@angular/core';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { IResponse, IActivityMonitoringResponse } from '../../../assets/interfaces/iresponse';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from "@angular/core";
import { NotificationService } from '../../../assets/services/notification.service';
import { IActivity } from '../../../assets/interfaces/iactivity';
import { ShareDataService } from '../../../assets/services/share-data.service';

export class TestServiceMock {
  iactivity: IActivityMonitoring =
    {
      anomaly: true,
      id: "1",
      objectDetected: false,
      noThreatConfig: "",
      anomalies.cellphone: "",
      anomalies.keys: "",
      threatHandgun: "",
      threatPipeBomb: "",
      threatRifle: "",
      threatStatus: true,
      creationTimestamp: "",
    }

  userList: IActivityMonitoring[] = [];
  public getThreatActivities(): Observable<IActivityMonitoringResponse> {
    this.userList.push(this.iactivity);

    let mockResponse: IActivityMonitoringResponse = {
      "status": 200,
      "data": this.userList
    };
    return of(mockResponse);

  }
}

export class mockBehaviorSubject<T> {
  private _value = 2;
  constructor(_value: T) {

  }
  readonly value: T;
  /** @deprecated This is an internal implementation detail, do not use. */
  // _subscribe(subscriber: Subscriber<T>): Subscription;
  getValue() { }
  // next(value: T): void;
}

export class MockMessagingService {
  mockMesage: Message = {
    ack: null,
    nack: null,
    command: "post",
    headers: { "": "" },
    body: JSON.stringify({ "id": 99, "noThreatConfig": "Full display", "objectDetected": null, "threatHandgun": null, "threatRifle": null, "threatPipeBomb": null, "anomaly": true, "anomalies.cellphone": null, "anomalies.keys": null, "threatStatus": null, "creationTimestamp": 1574746891070, "updateTimestamp": 1574746891070 }),
    isBinaryBody: false,
    binaryBody: new Uint8Array()
  };

  public messages: Observable<Message> = of(this.mockMesage);

  public stream(): Observable<Message> {
    return this.messages;
  }

  public send(url: string, message: any) {
    this.messages = of(message);
    return true;
  }

  public state(): Observable<StompState> {
    return;//of(2);
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

describe('ActivityThreatsComponent', () => {
  const routes: Routes = [
    {
      path: 'threatactivity',
      component: ActivityThreatsComponent,
      data: {
        title: 'Threat Activity Monitoring'
      },
      pathMatch: 'full',
      //canActivate: [AuthGuard]
    },
    {
      path: '',
      loadChildren: './user/user.module#UserModule'
    }];

  let component: ActivityThreatsComponent;
  let actComponent: ActivityThreatsComponent;
  let fixture: ComponentFixture<ActivityThreatsComponent>;
  let shareDataServicespy: jasmine.SpyObj<ShareDataService>;


  // beforeEach(() => {
  //   spyOn(mockMessagingService, 'stream').and.returnValue(mockMessagingService.stream());
  //   spyOn(mockMessagingService, 'send').and.returnValue(mockMessagingService.send("",messages));  
  //   spyOn(mockMessagingService, 'stream').and.returnValue(mockMessagingService.stream());
  // });
  let userService: UserService;
  let loginUserSpy: any;

  const mockUser: IUser = {
    id: "1",
    email: "test.abc@example.com",
    password: "abc",
    firstName: "abc",
    lastName: "xyz",
    loggedIn: true,
    loggedInDevice: "pc",
    expiryDate: null,
    creationTimestamp: "1574746891070",
    _rev: "1",
    device: "pc"
  };

  let mockUserList: IUser[] = [];
  mockUserList.push(mockUser);

  const mockResponse: IResponse = {
    "status": 200,
    "data": mockUserList
  };

  let translate: TranslateService;
  let injector: Injector;

  const MockElementRef: any = {
    get offsetLeft() {
      return 0;
    },
    get nativeElement() {
      return {};
    }
  };

  beforeEach(async(() => {
    const mockService = jasmine.createSpyObj('UserService', ['loginUser']);
    shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables',]);
    shareDataServicespy.getSharedData.and.returnValue({ "id": 99, "noThreatConfig": "Full display", "objectDetected": null, "threatHandgun": null, "threatRifle": null, "threatPipeBomb": null, "anomaly": true, "anomalies.cellphone": null, "anomalies.keys": null, "threatStatus": null, "creationTimestamp": 1574746891070, "updateTimestamp": 1574746891070 });
    loginUserSpy = mockService.loginUser.and.returnValue(of(mockResponse));
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);

    TestBed.configureTestingModule({
      declarations: [ActivityThreatsComponent],
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
        RouterModule.forRoot(routes, { useHash: true }),
        Ng4LoadingSpinnerModule.forRoot(),
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [ActivityThreatsComponent,
        { provide: ThreatActivityService, useClass: TestServiceMock },
        { provide: MessagingService, useClass: MockMessagingService },
        { provide: UserService, useValue: mockService },
        { provide: NotificationService, notificationService },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: ShareDataService, useValue: shareDataServicespy },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);
    component = TestBed.get(ActivityThreatsComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityThreatsComponent);
    actComponent = fixture.componentInstance;
    let messages: Observable<Message>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(actComponent).toBeTruthy();
  });

  it('#showObjects', () => {
    let acm: IActivityMonitoring = JSON.parse(JSON.stringify({ "id": "1", "noThreatConfig": "Full display", "objectDetected": null, "threatHandgun": "left chest", "threatRifle": null, "threatPipeBomb": null, "anomaly": null, "anomalies.cellphone": null, "anomalies.keys": null, "threatStatus": null, "creationTimestamp": "1574746891070", "updateTimestamp": 1574746891070 }));
    component.showObjects(acm, true);

    acm = JSON.parse(JSON.stringify({ "id": "1", "noThreatConfig": "Full display", "objectDetected": null, "threatHandgun": "left chest", "threatRifle": "left chest", "threatPipeBomb": "left chest", "anomaly": true, "anomalies.cellphone": "left chest", "anomalies.keys": "left chest", "threatStatus": null, "creationTimestamp": "1574746891070", "updateTimestamp": 1574746891070 }));
    component.showObjects(acm, true);

    acm.anomalies.keys = "right chest";
    acm.anomalies.cellphone = "left scapula";
    acm.threatHandgun = "right scapula";
    acm.threatPipeBomb = "center back";
    acm.threatRifle = "center lower back";
    component.showObjects(acm, true);

    acm.anomalies.keys = "right back pocket";
    acm.anomalies.cellphone = "left back pocket";
    acm.threatHandgun = "right thigh";
    acm.threatPipeBomb = "left thigh";
    acm.threatRifle = "abdomen";
    component.showObjects(acm, true);

    acm.objectDetected = true;
    component.showObjects(acm, true);

    // component.acms.push(acm);
    // component.selectActivity("1");
    // expect(component.timerFlag).toEqual(true);
  });

  it(`should call the highlightActivity method`, () => {
    component.highlightActivity("1");
    expect(component.highlightActivity).toBeTruthy();
  });
});
