import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { AddcustomerComponent } from './addcustomer.component';
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

import { CustomerService } from "../../../../assets/services/customer.service";
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

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

describe('AddcustomerComponent', () => {
  let component: AddcustomerComponent;
  let fixture: ComponentFixture<AddcustomerComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'addcustomer',
      component: AddcustomerComponent,
      data: {
        title: 'Add customer'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);

    TestBed.configureTestingModule({
      declarations: [AddcustomerComponent],
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
        { provide: NotificationService, useClass: mockNotificationService },
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
    fixture = TestBed.createComponent(AddcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('component should be defined', () => {
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
  //   expect(component.updateProgress).toBeTruthy();
  // });

  // it('should set submitted to be true', (() => {
  //   component.onSubmit();
  //   expect(component.onSubmit).toBeTruthy();
  // }));

  // it('should create a FormGroup comprised of FormControls', () => {
  //   component.ngOnInit();
  //   expect(component.form instanceof FormGroup).toBe(true);
  // });

  // it('form should be invalid', async(() => {
  //   component.form.controls['name'].setValue('');
  //   component.form.controls['email'].setValue('');
  //   expect(component.form.valid).toBeFalsy();
  // }));

  // it('form should be invalid', async(() => {
  //   component.form.controls['name'].setValue('abc');
  //   component.form.controls['email'].setValue('test.abc@example.com');
  //   expect(component.form.valid).toBeTruthy();
  // }));

  // it('should call the createCustomer from customerService on Submit', async(() => {
  //   inject([CustomerService], ((customerService: CustomerService) => {
  //     spyOn(customerService, 'createCustomer');
  //     let component = fixture.componentInstance;
  //     component.form.controls["name"].setValue("abc");
  //     component.form.controls["email"].setValue("test.abc@example.com");

  //     component.onSubmit();
  //     expect(customerService.createCustomer).toHaveBeenCalled();
  //   }));
  // }));
});
