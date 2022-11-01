import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { ModifycustomerComponent } from './modifycustomer.component';
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

import { CustomerService } from "../../../../assets/services/customer.service";
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material";
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { CustomerComponent } from '../customer.component';

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

  public updateCustomer(customer: ICustomer): Observable<ICustomer> {
    return of(this.customer);
  }

  public deleteCustomer(id: string, rev: string): Observable<ICustomer> {
    return of(this.customer);
  }
}

export class mockShareDataService {
  customer: ICustomer = {
    id: 1,
    name: "abc",
    email: "test.abc@example.com",
    creationTimestamp: "12234556",
    updateTimestamp: "12234556",
  };

  private sharedData: any;
  constructor() {
  }

  public getSharedData(): any {
    return this.customer;
  }

  public setSharedData(shared: any) {
    this.sharedData = this.customer;
  }
}

export class mocNotificationService {
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

describe('ModifycustomerComponent', () => {
  let component: ModifycustomerComponent;
  let fixture: ComponentFixture<ModifycustomerComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'modifycustomer',
      component: ModifycustomerComponent,
      data: {
        title: 'Modify customer'
      },
      pathMatch: 'full'
    },
    {
      path: 'admin/customer',
      component: CustomerComponent,
      data: {
        title: 'Customer'
      },
      pathMatch: 'full'
    }
  ];

  let customer: ICustomer = {
    id: 1,
    name: "abc",
    email: "test.abc@example.com",
    creationTimestamp: null,
    updateTimestamp: null,
  };

  // let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  // let shareDataServiceSpy: jasmine.SpyObj<ShareDataService>;

  beforeEach(async(() => {
    // const customer: ICustomer = {
    //   id: 1,
    //   name: "abc",
    //   email: "test.abc@example.com",
    //   creationTimestamp: null,
    //   updateTimestamp: null,
    // };

    // const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    // const shareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData,setSharedData']);

    TestBed.configureTestingModule({
      declarations: [ModifycustomerComponent, CustomerComponent],
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
        MatDialogModule,
        RouterModule.forRoot(routes, { useHash: true }),
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        { provide: CustomerService, useClass: mocCustomerService },
        { provide: NotificationService, useClass: mocNotificationService },
        //{ provide: MAT_DIALOG_DATA, useValue: customer },
        { provide: ShareDataService, useClass: mockShareDataService },
        DatePipe
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);

    // notificationServiceSpy=TestBed.get(NotificationService);
    // shareDataServiceSpy=TestBed.get(ShareDataService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifycustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set validateFields to be true', (() => {
    component.validateFields();
    expect(component.validateFields).toBeTruthy();
  }));

  it('should set updateProgress to be true', (() => {
    component.updateProgress();
    expect(component.updateProgress).toBeTruthy();
  }));

  it('should call the updateCustomer from customerService on Submit', async(() => {
    inject([CustomerService], ((customerService: CustomerService) => {
      spyOn(customerService, 'updateCustomer');

      let component = fixture.componentInstance;
      component.form.controls["name"].setValue("abc");
      component.form.controls["email"].setValue("test.abc@example.com");

      component.onSubmit();
      expect(customerService.updateCustomer).toHaveBeenCalled();
    }));
  }));
});
