// import { HttpClientModule } from "@angular/common/http";
// import { Injector } from "@angular/core";
// import { async, ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
// import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule } from "@angular/material";
// import { RouterModule, Routes } from "@angular/router";
// import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
// import { Observable, of } from "rxjs";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { ReportService } from "../../../../assets/services/report.service";
// import { IThroughputResponse, IWeaponDetectedResponse } from "../../../../assets/interfaces/iresponse";
// import { ChartsModule } from "ng2-charts";
// import { IThroughput, IWeaponDetected } from "../../../../assets/interfaces/ireports";
// import { ReportdashboardComponent } from "./reportdashboard.component";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// export class ReportDashboardService {

//     positionwisedata: IWeaponDetected = {
//         handgun: 0,
//         rifle: 0,
//         pipeBomb: 0,
//         anomaly: 0,
//         cellphone: 0,
//         knife: 0,
//         threat: 0,
//         keys: 0,
//         threatDate: 0,
//         threatPosition: ""
//     };

//     datewisedata: IWeaponDetected = {
//         handgun: 0,
//         rifle: 0,
//         pipeBomb: 0,
//         anomaly: 0,
//         cellphone: 0,
//         knife: 0,
//         threat: 0,
//         keys: 0,
//         threatDate: 0,
//         threatPosition: ""
//     };

//     throughputdata: IThroughput = {
//         date: 0,
//         hour: 0,
//         total: 0
//     };

//     datewisedataList: IWeaponDetected[] = [];
//     positionwisedataList: IWeaponDetected[] = [];
//     throughputdataList: IThroughput[] = [];

//     startDate: string = "";
//     endDate: string = "";


//     public getPositionwise(startDate, endDate): Observable<IWeaponDetectedResponse> {
//         this.positionwisedataList.push(this.positionwisedata);

//         let mockResponse: IWeaponDetectedResponse = {
//             "status": 200,
//             "data": this.positionwisedataList
//         };
//         return of(mockResponse);
//     }

//     public getDatewise(startDate, endDate): Observable<IWeaponDetectedResponse> {
//         this.datewisedataList.push(this.datewisedata);

//         let mockResponse: IWeaponDetectedResponse = {
//             "status": 200,
//             "data": this.datewisedataList
//         };
//         return of(mockResponse);
//     }

//     public getThroughput(startDate, endDate): Observable<IThroughputResponse> {
//         this.throughputdataList.push(this.throughputdata);

//         let mockResponse: IThroughputResponse = {
//             "status": 200,
//             "data": this.throughputdataList
//         };
//         return of(mockResponse);
//     }
// }

// let translations: any = { "CARDS_TITLE": "This is a test" };

// class FakeLoader implements TranslateLoader {
//     getTranslation(lang: string): Observable<any> {
//         return of(translations);
//     }
// }

// describe('Postionwisereport', () => {
//     let component: ReportdashboardComponent;
//     let fixture: ComponentFixture<ReportdashboardComponent>;
//     let translate: TranslateService;
//     let injector: Injector;

//     const routes: Routes = [
//         {
//             path: 'Reportdashboard',
//             component: ReportdashboardComponent,
//             data: {
//                 title: 'Report Dashboard'
//             },
//             pathMatch: 'full'
//         }
//     ];
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ReportdashboardComponent],
//             imports: [
//                 MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
//                 MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
//                 MatSliderModule, MatSlideToggleModule, MatIconModule,
//                 MatButtonModule,
//                 MatInputModule,
//                 MatListModule,
//                 MatMenuModule,
//                 MatSidenavModule,
//                 MatToolbarModule,
//                 MatSortModule,
//                 MatTableModule,
//                 MatPaginatorModule,
//                 HttpClientModule,
//                 ChartsModule,
//                 NgbModule,
//                 RouterModule.forRoot(routes, { useHash: true }),
//                 FormsModule, ReactiveFormsModule,
//                 BrowserAnimationsModule,
//                 TranslateModule.forRoot({
//                     loader: {
//                         provide: TranslateLoader,
//                         useClass: FakeLoader
//                     }
//                 })
//             ],
//             providers: [
//                 { provide: ReportService, useClass: ReportDashboardService },
//             ],
//             schemas: [
//                 //CUSTOM_ELEMENTS_SCHEMA
//             ]
//         })
//             .compileComponents();
//         injector = getTestBed();
//         translate = injector.get(TranslateService);
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(ReportdashboardComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });


//     // it('component should be defined', () => {
//     //     expect(component).toBeDefined();
//     // });

//     // it('should create', () => {
//     //     expect(component).toBeTruthy();
//     // });

//     // it(`should call the downloadPDF method`, () => {
//     //     component.downloadPDF();
//     //     expect(component.downloadPDF).toBeTruthy();
//     // });

// });
