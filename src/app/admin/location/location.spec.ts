import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatDialog
} from '@angular/material';
import { LocationService } from "../../../assets/services/location.service";
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ILocationResponse } from '../../../assets/interfaces/iresponse';
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
import { CustomerService } from '../../../assets/services/customer.service';
import { ShareDataService } from '../../../assets/services/share-data.service';

export class MocLocationService {
  location: ILocation = {
    id: 1,
    name: "abc",
    creationTimestamp: null,
    updateTimestamp: null,
    customer: {
      id: 1,
      email: "test.abc@example.com",
      creationTimestamp: null,
      updateTimestamp: null,
      name: "Basic"
    }
  };

  locationList: ILocation[] = [];

  public getLocation(): Observable<ILocationResponse> {
    this.locationList.push(this.location);

    let mockResponse: ILocationResponse = {
      "status": 200,
      "data": this.locationList
    };
    return of(mockResponse);
  }

  public addLocation(location: ILocation): Observable<ILocationResponse> {
    // return of(this.user);
    this.locationList.push(this.location);

    let mockResponse: ILocationResponse = {
      "status": 200,
      "data": this.locationList
    };

    return of(mockResponse);
  }

  public deleteLocation(id: string, rev: string): Observable<ILocation> {
    return of(this.location);
  }
}

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let injector: Injector;
  let dialog: MatDialog;


  const routes: Routes = [
    {
      path: 'location',
      component: LocationComponent,
      data: {
        title: 'Location'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData']);

    TestBed.configureTestingModule({
      declarations: [LocationComponent],
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
        { provide: LocationService, useClass: MocLocationService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, mockShareDataService }
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })

      .compileComponents();
    injector = getTestBed();
    // dialog = TestBed.get(MatDialog);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(function () {
    spyOn(console, 'error');
  })

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the filterDeployments method', () => {
    component.filterDeployments();
    expect(component.filterDeployments).toBeTruthy();
  });

  // it('should call the getLocation from LocationService', async(() => {
  //   inject([LocationService], ((locationService: LocationService) => {
  //     spyOn(locationService, 'getLocation');
  //     let component = fixture.componentInstance;
  //     component.ngOnInit();
  //     expect(locationService.getLocation).toHaveBeenCalled();
  //   }));
  // }));

  // it('should call the deleteLocation from userService', async(() => {
  //   inject([LocationService], ((locationService: LocationService) => {
  //     spyOn(locationService, 'deleteLocation');
  //     expect(locationService.deleteLocation).toHaveBeenCalled();
  //   }));
  // }));

  // it('should call update location', async () => {
  //   let button = fixture.debugElement.nativeElement.querySelector('button');
  //   button.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.openDialog).toHaveBeenCalled();
  //   });
  // });
});