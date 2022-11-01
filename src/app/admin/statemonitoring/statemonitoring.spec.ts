import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatDialog
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { StatemonitoringComponent } from './statemonitoring.component';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { StatemonitoringService } from '../../../assets/services/statemonitoring.service';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { IDevice } from '../../../assets/interfaces/idevice';
import { IDeviceResponse, IResponse } from '../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';

export class DeviceService {
    device: IDevice = {
        id: 1,
        creationTimestamp: "",
        updateTimestamp: "",
        name: "",
        macAddress: "",
        soundAddress: "",
        lightingAddress: "",
        leftProximitySensorAddress: "",
        rightProximitySensorAddress: "",
        physicalMark: "",
        side: "",
        status: true,
        spathFlag: true,
        tabletId: "",
        // lane: ILane,
        laneId: 1,
        laneName: "",
        entranceId: 1,
        entranceName: "",
        ipAddress: ""
    };

    deviceList: IDevice[] = [];

    public getDevices(): Observable<IDeviceResponse> {
        this.deviceList.push(this.device);

        let mockResponse: IDeviceResponse = {
            "status": 200,
            "data": this.deviceList
        };
        return of(mockResponse);
    }
}

describe('SatemonitoringComponent', () => {
    let component: StatemonitoringComponent;
    let fixture: ComponentFixture<StatemonitoringComponent>;
    let injector: Injector;
    let dialog: MatDialog;


    const routes: Routes = [
        {
            path: 'statemonitoring',
            component: StatemonitoringComponent,
            data: {
                title: 'StateMonitoring'
            },
            pathMatch: 'full'
        }
    ];
    beforeEach(async(() => {
        const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
        const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData']);

        TestBed.configureTestingModule({
            declarations: [StatemonitoringComponent],
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
                FormsModule, ReactiveFormsModule, HttpClientModule,
                BrowserAnimationsModule
            ],

            //providers:[{provide: MessagingService,useClass: mockMessagingService}],
            providers: [
                { provide: ShareDataService, mockShareDataService },
                DevicemanagementService, StatemonitoringService, ThreatActivityService
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
        fixture = TestBed.createComponent(StatemonitoringComponent);
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

    it('should call serviceStatus', async () => {
        component.serviceStatus();
        expect(component.serviceStatus).toBeTruthy();
    });

    it('should call onScreenClose', async () => {
        component.onScreenClose();
        expect(component.onScreenClose).toBeTruthy();
    });

    it('should call ngOnDestroy', async () => {
        component.ngOnDestroy();
        expect(component.ngOnDestroy).toBeTruthy();
    });

    it('should call devicesIP', async () => {
        component.devicesIP();
        expect(component.devicesIP).toBeTruthy();
    });

    it('should call changeServiceStatus', async () => {
        component.changeServiceStatus('backend', 'start');
        component.changeServiceStatus('backend', 'stop');
        component.changeServiceStatus('logging', 'start');
        component.changeServiceStatus('logging', 'stop');
        component.changeServiceStatus('pipeline', 'start');
        component.changeServiceStatus('pipeline', 'stop');
        expect(component.devicesIP).toBeTruthy();
    });

});