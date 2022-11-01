import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { async, ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IDevice } from "../../../../../assets/interfaces/idevice";
import { IDeviceResponse, ITabletResponse } from "../../../../../assets/interfaces/iresponse";
import { NotificationService } from "../../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../../assets/services/share-data.service";
import { DevicemanagementService } from "../../../../../assets/services/devicemanagement.service";
import { RdevicescanComponent } from "./rdevicescan.component";
import { DeviceDetectSimulatorService } from "../../../../../assets/services/device-detect-simulator.service";

export class MocDeviceManagementService {
    device: IDevice = {
        id: 1,
        name: "abc",
        laneId: 1,
        macAddress: "abc",
        soundAddress: "xyz",
        lightingAddress: "la",
        leftProximitySensorAddress: "lpsa",
        rightProximitySensorAddress: "rpsa",
        status: true,
        side: "left",
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

    public updateDevice(device: IDevice): Observable<ITabletResponse> {
        this.deviceList.push(this.device);

        let mockResponse: ITabletResponse = {
            "status": 200,
            "data": this.deviceList
        };

        return of(mockResponse);
    }
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(translations);
    }
}

describe('RdevicescanComponent', () => {
    let component: RdevicescanComponent;
    let fixture: ComponentFixture<RdevicescanComponent>;
    let translate: TranslateService;
    let injector: Injector;

    const routes: Routes = [
        {
            path: 'Rdevicescan',
            component: RdevicescanComponent,
            data: {
                title: 'R device scan'
            },
            pathMatch: 'full'
        }
    ];
    beforeEach(async(() => {
        const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        shareDataServicespy.getSharedData.and.returnValue(true);

        TestBed.configureTestingModule({
            declarations: [RdevicescanComponent],
            imports: [
                MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
                MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
                MatSliderModule, MatSlideToggleModule, MatIconModule,
                MatButtonModule,
                MatInputModule,
                MatListModule,
                MatMenuModule,
                MatSidenavModule,
                MatToolbarModule,
                MatSortModule,
                MatTableModule,
                MatPaginatorModule,
                HttpClientModule,
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
                { provide: NotificationService, useValue: notificationService },
                { provide: ShareDataService, useValue: shareDataServicespy },
                { provide: DevicemanagementService, useClass: MocDeviceManagementService },
                DeviceDetectSimulatorService
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
        fixture = TestBed.createComponent(RdevicescanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('component should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call the openRightDevice method', () => {
        component.openRightDevice();
        expect(component.openRightDevice).toBeTruthy();
    });

    it('should call the onSubmit method', () => {
        component.onSubmit();
        expect(component.onSubmit).toBeTruthy();
    });

    it('should call the getDevice method', () => {
        component.getDevice();
        expect(component.getDevice).toBeTruthy();
    });

    it('should call the changeDevice method', () => {
        component.changeDevice(1);
        expect(component.changeDevice).toBeTruthy();
    });

});
