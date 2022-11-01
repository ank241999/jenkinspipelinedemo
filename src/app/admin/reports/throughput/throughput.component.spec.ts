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
import { IThroughputResponse } from "../../../../assets/interfaces/iresponse";
import { ChartsModule } from "ng2-charts";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { IThroughput } from "../../../../assets/interfaces/ireports";
import { ThroughputComponent } from "./throughput.component";

export class ThroughputReportService {

    throughputdata: IThroughput = {
        date: 0,
        hour: 0,
        total: 0
    }

    throughputdataList: IThroughput[] = [];

    startDate: string = "";
    endDate: string = "";


    public getThroughput(startDate, endDate): Observable<IThroughputResponse> {
        this.throughputdataList.push(this.throughputdata);

        let mockResponse: IThroughputResponse = {
            "status": 200,
            "data": this.throughputdataList
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

describe('Throughputreport', () => {
    let component: ThroughputComponent;
    let fixture: ComponentFixture<ThroughputComponent>;
    let translate: TranslateService;
    let injector: Injector;

    const routes: Routes = [
        {
            path: 'Throughputreport',
            component: ThroughputComponent,
            data: {
                title: 'Throughput Report'
            },
            pathMatch: 'full'
        }
    ];
    beforeEach(async(() => {
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        shareDataServicespy.getSharedData.and.returnValue(true);

        TestBed.configureTestingModule({
            declarations: [ThroughputComponent],
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
                { provide: ReportService, useClass: ThroughputReportService },
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
        fixture = TestBed.createComponent(ThroughputComponent);
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

    it(`should call the table1Filter method`, () => {
        component.table1Filter('');
        expect(component.table1Filter).toBeTruthy();
    });

    it(`should call the resetDatePicker method`, () => {
        component.resetDatePicker();
        expect(component.resetDatePicker).toBeTruthy();
    });

    it(`should call the resetDatePickerTo method`, () => {
        component.resetDatePickerTo();
        expect(component.resetDatePickerTo).toBeTruthy();
    });

    it(`should call the dateValid method`, () => {
        component.dateValid();
        expect(component.dateValid).toBeTruthy();
    });

    // it(`should call the downloadPDF method`, () => {
    //     component.downloadPDF();
    //     expect(component.downloadPDF).toBeTruthy();
    // });

});
