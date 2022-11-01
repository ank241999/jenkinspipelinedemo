import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddlocationComponent } from './addlocation.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
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
import { LocationService } from "../../../../assets/services/location.service";
import { ILocation } from '../../../../assets/interfaces/ilocation';
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { ILocationResponse } from '../../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../../../assets/services/customer.service';

export class mocLocationService {
  customer: ICustomer = {
    id: 1,
    name: "abc",
    email: "test.abc@example.com",
    creationTimestamp: null,
    updateTimestamp: null,
  };

  location: ILocation = {
    id: 1,
    name: "abc",
    creationTimestamp: null,
    updateTimestamp: null,
    customer: this.customer
  };

  locationList: ILocation[] = [];

  public getLocation(): Observable<ILocation[]> {
    this.locationList.push(this.location);

    // let mockResponse: ILocationResponse = {
    //   "status": 200,
    //   "data": this.locationList
    // };
    return of(this.locationList);
  }

  public addLocation(location: ILocation): Observable<ILocation> {
    // return of(this.user);
    // this.locationList.push(this.location);

    // let mockResponse: ILocationResponse = {
    //   "status": 200,
    //   "data": this.locationList
    // };

    return of(this.location);
  }

  public updateLocation(location: ILocation): Observable<ILocation> {
    return of(this.location);
  }

  public deleteLocation(id: string, rev: string): Observable<ILocation> {
    return of(this.location);
  }
}

export class mocCustomerService {
  customer: ICustomer = {
    id: 1,
    name: "abc",
    email: "test.abc@example.com",
    creationTimestamp: null,
    updateTimestamp: null,
  };

  customerList: ICustomer[] = [];

  public getCustomers(): Observable<ICustomer[]> {
    this.customerList.push(this.customer);
    return of(this.customerList);
  }

  public createCustomer(customer: ICustomer): Observable<ICustomer> {
    return of(this.customer);
  }

  public deleteCustomer(id: string, rev: string): Observable<ICustomer> {
    return of(this.customer);
  }
}

export class mockNotificationService {
  constructor() { }

  showNotification(message, vpos, hpos, type, icon = ''): void {
  }
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('AddlocationComponent', () => {
  let component: AddlocationComponent;
  let fixture: ComponentFixture<AddlocationComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'addlocation',
      component: AddlocationComponent,
      data: {
        title: 'Add location'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    // const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);

    TestBed.configureTestingModule({
      declarations: [AddlocationComponent],
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
        { provide: LocationService, useClass: mocLocationService },
        // { provide: NotificationService, notificationService },
        { provide: NotificationService, useClass: mockNotificationService },
        { provide: CustomerService, useClass: mocCustomerService },
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
    fixture = TestBed.createComponent(AddlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  // it('should set submitted to be true', (() => {
  //   component.onSubmit();
  //   expect(component.onSubmit).toBeTruthy();
  // }));

  // it('should create a FormGroup comprised of FormControls', () => {
  //   component.ngOnInit();
  //   expect(component.form instanceof FormGroup).toBe(true);
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('form should be invalid', async(() => {
  //   component.form.controls['customerId'].setValue('');
  //   component.form.controls['name'].setValue('');

  //   expect(component.form.valid).toBeFalsy();
  // }));

  // it('should call the addLocation from locationService on Submit', async(() => {
  //   inject([LocationService], ((locationService: LocationService) => {
  //     spyOn(locationService, 'addLocation');
  //     let component = fixture.componentInstance;
  //     component.onSubmit();
  //     expect(locationService.addLocation).toHaveBeenCalled();
  //   }));
  // }));

  // it('#validateFields()', () => {
  //   component.validateFields();
  // });

  // it('#updateProgress()', () => {
  //   component.updateProgress();
  // });

  // it('#onSubmit()', () => {
  //   component.form.controls["customerId"].setValue("1");
  //   component.form.controls["name"].setValue("test");

  //   component.onSubmit();
  //   component.formatDate(new Date());
  // });
});
