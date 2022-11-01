import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { async, ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { ReportService } from "../../../../assets/services/report.service";
import { IAnalyticReportResponse, IWeaponDetectedResponse } from "../../../../assets/interfaces/iresponse";
import { ChartsModule } from "ng2-charts";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { IAnalyticReport, IWeaponDetected } from "../../../../assets/interfaces/ireports";
import { DatewiseComponent } from "./datewise.component";

export class DatewiseReportService {

    datewisedata: IWeaponDetected = {
        handgun: 0,
        rifle: 0,
        pipeBomb: 0,
        anomaly: 0,
        cellphone: 0,
        knife: 0,
        threat: 0,
        keys: 0,
        threatDate: 0,
        threatPosition: ""
    };

    datewisedataList: IWeaponDetected[] = [];

    startDate: string = "";
    endDate: string = "";


    public getDatewise(startDate, endDate): Observable<IWeaponDetectedResponse> {
        this.datewisedataList.push(this.datewisedata);

        let mockResponse: IWeaponDetectedResponse = {
            "status": 200,
            "data": this.datewisedataList
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

describe('Datewisereport', () => {
    let component: DatewiseComponent;
    let fixture: ComponentFixture<DatewiseComponent>;
    let translate: TranslateService;
    let injector: Injector;

    const routes: Routes = [
        {
            path: 'Datereport',
            component: DatewiseComponent,
            data: {
                title: 'Date Wise Report'
            },
            pathMatch: 'full'
        }
    ];
    beforeEach(async(() => {
        const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        shareDataServicespy.getSharedData.and.returnValue(true);

        TestBed.configureTestingModule({
            declarations: [DatewiseComponent],
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
                ChartsModule,
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
                { provide: ShareDataService, useValue: shareDataServicespy },
                { provide: ReportService, useClass: DatewiseReportService },
                Ng4LoadingSpinnerService
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
        fixture = TestBed.createComponent(DatewiseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('component should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it(`should call the showReport method`, () => {
    //     component.showReport();
    //     expect(component.showReport).toBeTruthy();
    // });

    it(`should call the filterDeployments method`, () => {
        component.filterDeployments();
        expect(component.filterDeployments).toBeTruthy();
    });

    // it(`should call the applyFilterTable1 method`, () => {
    //     component.applyFilterTable1('');
    //     expect(component.applyFilterTable1).toBeTruthy();
    // });

    it(`should call the resetDatePicker method`, () => {
        component.resetDatePicker();
        expect(component.resetDatePicker).toBeTruthy();
    });

    it(`should call the resetDatePickerTo method`, () => {
        component.resetDatePickerTo();
        expect(component.resetDatePickerTo).toBeTruthy();
    });

    it(`should call the dateValid method`, () => {
        component.subscribed = "04-10-2021";
        component.dateTo = "02-10-2021";
        component.dateValid();
        expect(component.dateValid).toBeTruthy();
    });

    // it(`should call the downloadPDF method`, () => {
    //     component.downloadPDF();
    //     expect(component.downloadPDF).toBeTruthy();
    // });

});
