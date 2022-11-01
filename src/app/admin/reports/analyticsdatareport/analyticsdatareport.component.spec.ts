import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { async, ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AnalyticsdatareportComponent } from "./analyticsdatareport.component";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { ReportService } from "../../../../assets/services/report.service";
import { IAnalyticReportResponse } from "../../../../assets/interfaces/iresponse";
import { ChartsModule } from "ng2-charts";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { IAnalyticReport } from "../../../../assets/interfaces/ireports";

export class AnalyticReportService {

    analyticdata: IAnalyticReport = {
        totalThreatThreat: 0,
        leftscapulafront: 0,
        rightscapulafront: 0,
        rightscapulaback: 0,
        rightfrontpocket: 0,
        isCorrect: true,
        totalCorrect: 0,
        totalIncorrect: 0,
        threatTypes: 0,
        totalThreat: 0,
        totalAnomaly: 0,
        totalNoThreat: 0,
        weapons: 0,
        totalHandgun: 0,
        totalPipeBomb: 0,
        totalRifle: 0,
        totalKnife: 0,
        totalCellphone: 0,
        totalKeys: 0,
        locations: 0,
        leftchestfront: 0,
        leftchestback: 0,
        rightchestfront: 0,
        rightchestback: 0,
        leftscapulaback: 0,
        abdomenfront: 0,
        abdomenback: 0,
        centerback: 0,
        centerlowerback: 0,
        leftthighfront: 0,
        leftthighback: 0,
        rightthighfront: 0,
        rightthighback: 0,
        leftfrontpocket: 0,
        leftbackpocket: 0,
        rightbackpocket: 0,
        lefthipfront: 0,
        lefthipback: 0,
        righthipfront: 0,
        righthipback: 0,
        leftAnkle: 0,
        rightAnkle: 0
    };

    analyticdataList: IAnalyticReport[] = [];

    startDate: string = "";
    endDate: string = "";


    public getBetaTestModeReportList(startDate, endDate): Observable<IAnalyticReportResponse> {
        this.analyticdataList.push(this.analyticdata);

        let mockResponse: IAnalyticReportResponse = {
            "status": 200,
            "data": this.analyticdataList
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

describe('Analyticdatareport', () => {
    let component: AnalyticsdatareportComponent;
    let fixture: ComponentFixture<AnalyticsdatareportComponent>;
    let translate: TranslateService;
    let injector: Injector;

    const routes: Routes = [
        {
            path: 'Analyticreport',
            component: AnalyticsdatareportComponent,
            data: {
                title: 'Analytic Report'
            },
            pathMatch: 'full'
        }
    ];
    beforeEach(async(() => {
        const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        shareDataServicespy.getSharedData.and.returnValue(true);

        TestBed.configureTestingModule({
            declarations: [AnalyticsdatareportComponent],
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
                { provide: ReportService, useClass: AnalyticReportService },
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
        fixture = TestBed.createComponent(AnalyticsdatareportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('component should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should call the resetDatePicker method`, () => {
        component.resetDatePicker();
        expect(component.resetDatePicker).toBeTruthy();
    });

    it(`should call the resetDatePickerTo method`, () => {
        component.resetDatePickerTo();
        expect(component.resetDatePickerTo).toBeTruthy();
    });

    it(`should call the changeRange method`, () => {
        component.changeRange('Monthly');
        expect(component.changeRange).toBeTruthy();
    });

    it(`should call the showReport method`, () => {
        component.showReport();
        expect(component.showReport).toBeTruthy();
    });

    it(`should call the getData method`, () => {
        component.getData();
        expect(component.getData).toBeTruthy();
    });

    it(`should call the setLocationChartValue method`, () => {
        component.correctData = {
            totalThreatThreat: 0,
            leftscapulafront: 0,
            rightscapulafront: 0,
            rightscapulaback: 0,
            rightfrontpocket: 0,
            isCorrect: true,
            totalCorrect: 0,
            totalIncorrect: 0,
            threatTypes: 0,
            totalThreat: 0,
            totalAnomaly: 0,
            totalNoThreat: 0,
            weapons: 0,
            totalHandgun: 0,
            totalPipeBomb: 0,
            totalRifle: 0,
            totalKnife: 0,
            totalCellphone: 0,
            totalKeys: 0,
            locations: 0,
            leftchestfront: 0,
            leftchestback: 0,
            rightchestfront: 0,
            rightchestback: 0,
            leftscapulaback: 0,
            abdomenfront: 0,
            abdomenback: 0,
            centerback: 0,
            centerlowerback: 0,
            leftthighfront: 0,
            leftthighback: 0,
            rightthighfront: 0,
            rightthighback: 0,
            leftfrontpocket: 0,
            leftbackpocket: 0,
            rightbackpocket: 0,
            lefthipfront: 0,
            lefthipback: 0,
            righthipfront: 0,
            righthipback: 0,
            leftAnkle: 0,
            rightAnkle: 0
        }

        component.incorrectData = {
            totalThreatThreat: 0,
            leftscapulafront: 0,
            rightscapulafront: 0,
            rightscapulaback: 0,
            rightfrontpocket: 0,
            isCorrect: false,
            totalCorrect: 0,
            totalIncorrect: 0,
            threatTypes: 0,
            totalThreat: 0,
            totalAnomaly: 0,
            totalNoThreat: 0,
            weapons: 0,
            totalHandgun: 0,
            totalPipeBomb: 0,
            totalRifle: 0,
            totalKnife: 0,
            totalCellphone: 0,
            totalKeys: 0,
            locations: 0,
            leftchestfront: 0,
            leftchestback: 0,
            rightchestfront: 0,
            rightchestback: 0,
            leftscapulaback: 0,
            abdomenfront: 0,
            abdomenback: 0,
            centerback: 0,
            centerlowerback: 0,
            leftthighfront: 0,
            leftthighback: 0,
            rightthighfront: 0,
            rightthighback: 0,
            leftfrontpocket: 0,
            leftbackpocket: 0,
            rightbackpocket: 0,
            lefthipfront: 0,
            lefthipback: 0,
            righthipfront: 0,
            righthipback: 0,
            leftAnkle: 0,
            rightAnkle: 0
        }
        component.setLocationChartValue();
        expect(component.setLocationChartValue).toBeTruthy();
    });

    it(`should call the setChartValues method`, () => {
        component.correctData = {
            totalThreatThreat: 0,
            leftscapulafront: 0,
            rightscapulafront: 0,
            rightscapulaback: 0,
            rightfrontpocket: 0,
            isCorrect: true,
            totalCorrect: 0,
            totalIncorrect: 0,
            threatTypes: 0,
            totalThreat: 0,
            totalAnomaly: 0,
            totalNoThreat: 0,
            weapons: 0,
            totalHandgun: 0,
            totalPipeBomb: 0,
            totalRifle: 0,
            totalKnife: 0,
            totalCellphone: 0,
            totalKeys: 0,
            locations: 0,
            leftchestfront: 0,
            leftchestback: 0,
            rightchestfront: 0,
            rightchestback: 0,
            leftscapulaback: 0,
            abdomenfront: 0,
            abdomenback: 0,
            centerback: 0,
            centerlowerback: 0,
            leftthighfront: 0,
            leftthighback: 0,
            rightthighfront: 0,
            rightthighback: 0,
            leftfrontpocket: 0,
            leftbackpocket: 0,
            rightbackpocket: 0,
            lefthipfront: 0,
            lefthipback: 0,
            righthipfront: 0,
            righthipback: 0,
            leftAnkle: 0,
            rightAnkle: 0
        }

        component.incorrectData = {
            totalThreatThreat: 0,
            leftscapulafront: 0,
            rightscapulafront: 0,
            rightscapulaback: 0,
            rightfrontpocket: 0,
            isCorrect: false,
            totalCorrect: 0,
            totalIncorrect: 0,
            threatTypes: 0,
            totalThreat: 0,
            totalAnomaly: 0,
            totalNoThreat: 0,
            weapons: 0,
            totalHandgun: 0,
            totalPipeBomb: 0,
            totalRifle: 0,
            totalKnife: 0,
            totalCellphone: 0,
            totalKeys: 0,
            locations: 0,
            leftchestfront: 0,
            leftchestback: 0,
            rightchestfront: 0,
            rightchestback: 0,
            leftscapulaback: 0,
            abdomenfront: 0,
            abdomenback: 0,
            centerback: 0,
            centerlowerback: 0,
            leftthighfront: 0,
            leftthighback: 0,
            rightthighfront: 0,
            rightthighback: 0,
            leftfrontpocket: 0,
            leftbackpocket: 0,
            rightbackpocket: 0,
            lefthipfront: 0,
            lefthipback: 0,
            righthipfront: 0,
            righthipback: 0,
            leftAnkle: 0,
            rightAnkle: 0
        }
        component.setChartValues();
        expect(component.setChartValues).toBeTruthy();
    });

    // it(`should call the generatePDF method`, () => {
    //     component.generatePDF();
    //     expect(component.generatePDF).toBeTruthy();
    // });

    it(`should call the showTabularReport method`, () => {
        component.showTabularReport("Locations", true, "Weapon");
        expect(component.showTabularReport).toBeTruthy();
    });

});
