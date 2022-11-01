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
import { IThreatLogsResponse } from "../../../../assets/interfaces/iresponse";
import { ChartsModule } from "ng2-charts";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { IThreatLog } from "../../../../assets/interfaces/ithreatlog";
import { ThreatlogsreportComponent } from "./threatlogsreport.component";

export class ThreatLogsReportService {

    threatlogsdata: IThreatLog = {
        actualResult: true,
        creationTimestamp: 0,
        deviceMacAddress: "",
        gateName: "",
        id: 0,
        laneName: "",
        note: "",
        threatLocation: "",
        threatType: "",
        updateTimestamp: 0,
        userName: "",
        typeOfWeapon: "",
        threatConfigId: "",
    }

    threatlogsdataList: IThreatLog[] = [];

    startDate: string = "";
    endDate: string = "";


    public getThreatLogsReport(startDate, endDate): Observable<IThreatLogsResponse> {
        this.threatlogsdataList.push(this.threatlogsdata);

        let mockResponse: IThreatLogsResponse = {
            "status": 200,
            "data": this.threatlogsdataList
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

describe('Threatlogsreport', () => {
    let component: ThreatlogsreportComponent;
    let fixture: ComponentFixture<ThreatlogsreportComponent>;
    let translate: TranslateService;
    let injector: Injector;

    const routes: Routes = [
        {
            path: 'Threatlogsreport',
            component: ThreatlogsreportComponent,
            data: {
                title: 'Threat Logs Report'
            },
            pathMatch: 'full'
        }
    ];
    beforeEach(async(() => {
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        shareDataServicespy.getSharedData.and.returnValue(true);

        TestBed.configureTestingModule({
            declarations: [ThreatlogsreportComponent],
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
                { provide: ReportService, useClass: ThreatLogsReportService },
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
        fixture = TestBed.createComponent(ThreatlogsreportComponent);
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
    //     component.showReport("initial");
    //     expect(component.showReport).toBeTruthy();
    // });

    it(`should call the filterDeployments method`, () => {
        component.filterDeployments();
        expect(component.filterDeployments).toBeTruthy();
    });

    it(`should call the table1Filter method`, () => {
        component.table1Filter('');
        expect(component.table1Filter).toBeTruthy();
    });

    // it(`should call the resetDatePicker method`, () => {
    //     component.resetDatePicker();
    //     expect(component.resetDatePicker).toBeTruthy();
    // });

    it(`should call the resetDatePickerTo method`, () => {
        component.resetDatePickerTo();
        expect(component.resetDatePickerTo).toBeTruthy();
    });

    it(`should call the dateValid method`, () => {
        component.dateValid();
        expect(component.dateValid).toBeTruthy();
    });

    it(`should call the downloadEXCEL method`, () => {
        component.downloadEXCEL();
        expect(component.downloadEXCEL).toBeTruthy();
    });

    it(`should call the onScreenBack method`, () => {
        component.onScreenBack();
        expect(component.onScreenBack).toBeTruthy();
    });

    it(`should call the onScreenClose method`, () => {
        component.onScreenClose();
        expect(component.onScreenClose).toBeTruthy();
    });

    // it(`should call the onPaginateChange method`, () => {
    //     component.onPaginateChange('');
    //     expect(component.onPaginateChange).toBeTruthy();
    // });

});
