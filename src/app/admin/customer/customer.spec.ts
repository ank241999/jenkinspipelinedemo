import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatDialog
} from '@angular/material';
import { CustomerService } from "../../../assets/services/customer.service";
import { ICustomer } from '../../../assets/interfaces/icustomer';
import { ICustomerResponse } from '../../../assets/interfaces/iresponse';
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
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { ShareDataService } from '../../../assets/services/share-data.service';

export class MocCustomerService {
  customer: ICustomer = {
    id: 1,
    email: "test.abc@example.com",
    name: "abc",
    creationTimestamp: null,
    updateTimestamp: null,
  };

  customerList: ICustomer[] = [];

  public getCustomers(): Observable<ICustomerResponse> {
    this.customerList.push(this.customer);

    let mockResponse: ICustomerResponse = {
      "status": 200,
      "data": this.customerList
    };
    return of(mockResponse);
  }

  public createCustomer(customer: ICustomer): Observable<ICustomerResponse> {
    // return of(this.user);
    this.customerList.push(this.customer);

    let mockResponse: ICustomerResponse = {
      "status": 200,
      "data": this.customerList
    };

    return of(mockResponse);
  }

  public updateCustomer(customer: ICustomer): Observable<ICustomerResponse> {
    // return of(this.user);
    this.customerList.push(this.customer);

    let mockResponse: ICustomerResponse = {
      "status": 200,
      "data": this.customerList
    };

    return of(mockResponse);
  }

  public deleteCustomer(id: string, rev: string): Observable<ICustomer> {
    return of(this.customer);
  }
}

describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;
  let injector: Injector;
  let dialog: MatDialog;

  const routes: Routes = [
    {
      path: 'customer',
      component: CustomerComponent,
      data: {
        title: 'customer'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData']);

    TestBed.configureTestingModule({
      declarations: [CustomerComponent],
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
        FormsModule, ReactiveFormsModule, HttpClientModule,
        BrowserAnimationsModule
      ],

      //providers:[{provide: MessagingService,useClass: mockMessagingService}],
      providers: [
        { provide: CustomerService, useClass: MocCustomerService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, mockShareDataService }
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();

    injector = getTestBed();
    dialog = TestBed.get(MatDialog);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(function () {
    spyOn(console, 'error');
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it(`should call the filterDeployments method`, () => {
  //     component.filterDeployments();
  //     expect(component.filterDeployments).toBeTruthy();
  //   });

  it('should call the getCustomers from CustomerService on Submit', async(() => {
    inject([CustomerService], ((customerService: CustomerService) => {
      spyOn(customerService, 'getCustomers');
      component.ngOnInit();
      expect(customerService.getCustomers).toHaveBeenCalled();
    }));
  }));

  // it(`should call the deleteLocation from userService`, async(() => {
  //   inject([LocationService], ((locationService: LocationService) => {
  //     spyOn(locationService, 'deleteLocation');
  //     expect(locationService.deleteLocation).toHaveBeenCalled();
  //   }));
  // }));

  // it('should call open Dialog', async () => {
  //   let button = fixture.debugElement.nativeElement.querySelector('button');
  //   button.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.openDialog).toHaveBeenCalled(); 
  //   });
  // });
});