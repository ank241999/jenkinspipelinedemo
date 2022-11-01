import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit, ViewChildren } from '@angular/core';
import { Location } from '@angular/common';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from '../../../../assets/services/report.service';
import { IThreatLogReport, IThroughput } from '../../../../assets/interfaces/ireports';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';

import * as _moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as XLSX from 'xlsx';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
var $ = require('jquery');

const moment = _moment;

@Component({
  selector: 'app-threatlogsreport',
  templateUrl: './threatlogsreport.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss', './threatlogsreport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ThreatlogsreportComponent implements OnInit {
  logs: IThreatLogReport[] = [];

  displayedColumns: string[] = ['guardName', 'deviceName', 'gateName', 'laneName', 'creationDate', 'actualResult', 'configWeaponType', 'configThreatType', 'configThreatLocation', 'logWeaponType', 'logThreatType', 'logThreatLocation', 'notes'];
  dataSource: MatTableDataSource<IThreatLogReport>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IThreatLogReport>(true, []);

  filtersVisible = true;
  isBrowser: boolean;

  filtersForm: FormGroup;

  threatLocations = [
    { id: "1", value: "Left chest front" },
    { id: "2", value: "Left chest back" },
    { id: "3", value: "Right chest front" },
    { id: "4", value: "Right chest back" },
    { id: "5", value: "Left scapula front" },
    { id: "6", value: "Left scapula back" },
    { id: "7", value: "Right scapula front" },
    { id: "8", value: "Right scapula back" },
    { id: "9", value: "Abdomen front" },
    { id: "10", value: "Abdomen back" },
    { id: "11", value: "Center back" },
    { id: "12", value: "Center lower back" },
    { id: "13", value: "Left thigh front" },
    { id: "14", value: "Left thigh back" },
    { id: "15", value: "Right thigh front" },
    { id: "16", value: "Right thigh back" },
    { id: "17", value: "Left front pocket" },
    { id: "18", value: "Left back pocket" },
    { id: "19", value: "Right front pocket" },
    { id: "20", value: "Right back pocket" },
    { id: "21", value: "Left hip front" },
    { id: "22", value: "Left hip back" },
    { id: "23", value: "Right hip front" },
    { id: "24", value: "Right hip back" },
    { id: "25", value: "Left Ankle" },
    { id: "26", value: "Right Ankle" }
  ];

  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateTo: string;
  showBackButton: boolean = false;

  reportContent: any;
  fromDate: number;
  toDate: number;
  isEnabled: boolean = false;

  totalRecords: number;
  pageSizeOptions: number[] = [100, 200, 1000];
  pageSize: number = 100;
  //MtPaginator Output
  pageEvent: PageEvent;

  pageFrom: number = 0;
  pageTo: number = 100;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private location: Location,
    private translate: TranslateService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.isBrowser = isPlatformBrowser(platformId);
    this.filtersForm = fb.group({
      search: '',
      dateFrom: new FormControl(moment([this.currYear, this.currMonth - 1, this.currentDate.getDate()])),
      dateTo: new FormControl(moment([this.currYear, this.currMonth, this.currentDate.getDate()])),
      threatType: new FormControl(""),
      weapon: new FormControl(""),
      location: new FormControl(""),
      isCorrectResult: new FormControl("all"),
      incorrectRecordsBy: new FormControl("all")
    });

    this.fromDate = new Date(this.currYear, this.currMonth - 1, this.currentDate.getDate()).getTime();
    this.toDate = new Date(this.currYear, this.currMonth, this.currentDate.getDate()).getTime();
    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });

    let correctResult = this.route.snapshot.queryParamMap.get('correctResult');
    if (correctResult) {
      var routeData = this.shareDataService.getSharedData();
      console.log(routeData);
      this.filtersForm.controls["dateFrom"].patchValue(routeData['dateFrom']);
      this.filtersForm.controls["dateTo"].patchValue(routeData['dateTo']);
      this.filtersForm.controls["threatType"].patchValue(routeData['threatType']);
      this.filtersForm.controls["weapon"].patchValue(routeData['weapon']);
      this.filtersForm.controls["location"].patchValue(routeData['location']);
      this.filtersForm.controls["isCorrectResult"].patchValue(routeData['isCorrect']);
      this.filtersForm.controls["incorrectRecordsBy"].patchValue(routeData['incorrectRecordsBy']);

      this.showReport("initial");
      this.showBackButton = true;
    }
  }

  ngOnInit() {
    $("#showdata").prev().hide();
  }

  showReport(value: any) {
    this.spinnerService.show();
    let daySeconds: number = ((60 * 60 * 24) - 1) * 1000;
    let fromDate: string = "";
    let toDate: string = "";

    if (this.filtersForm.controls["dateFrom"].value) {
      this.subscribed = this.filtersForm.value.dateFrom;
      fromDate = this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00');//new Date(this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00')).getTime() - 1;
    }
    if (this.filtersForm.controls["dateTo"].value) {
      this.dateTo = this.filtersForm.value.dateTo;
      toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 23:59:59');//new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 00:00:00')).getTime() + daySeconds;
    }

    this.reportService.getThreatLogsReport(fromDate.toString(), toDate.toString(), this.pageFrom,
      this.pageTo,
      this.filtersForm.controls["weapon"].value,
      this.filtersForm.controls["location"].value,
      this.filtersForm.controls["threatType"].value,
      this.filtersForm.controls["isCorrectResult"].value,
      this.filtersForm.controls["incorrectRecordsBy"].value).subscribe(res => {
        //console.log(res);
        if (res == null) {
          $("#showdata").show();
          $("#showdata").prev().hide();
        }
        else {
          this.logs = res;
          
          this.logs.forEach(x => {
            x.creationDate = x.creationDate + "Z";
          });
          
          if (this.logs.length == 0) {
            $("#showdata").show();
            $("#showdata").prev().hide();
          }
          else {
            this.totalRecords = +this.logs[0].maxTotalRecord;
            $("#showdata").hide();
            $("#showdata").prev().show();
            this.isEnabled = true;
          }

          if (value == "initial") {
            this.filterDeployments();
          }
          else {
            this.dataSource = new MatTableDataSource(this.logs);
            this.dataSource.sortingDataAccessor = (item, property) => {
              return item[property];
            };
            this.dataSource.sort = this.sort;
          }

          this.spinnerService.hide();
        }
      });
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.logs);
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };
    //setTimeout(() => {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //}, 0);
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  // clearFilters(): void {
  //   this.filtersForm.reset({
  //     search: '',
  //     subscribed: '',
  //     dateTo: ''
  //   });

  //   this.applyFilterTable1('');
  //   this.table1Filter(this.filtersForm.value);
  // }

  resetDatePicker(): void {
    this.filtersForm.controls.subscribed.reset('');
  }

  resetDatePickerTo(): void {
    this.filtersForm.controls.dateTo.reset('');
  }

  // applyFilterTable1(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  table1Filter(form): void {
    const ageRange = form.ageRange;
    this.subscribed = form.subscribed;
    this.dateTo = form.dateTo;
    let daySeconds: number = ((60 * 60 * 24) - 1) * 1000;

    this.fromDate = new Date(this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00')).getTime() - 1;
    this.toDate = new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 00:00:00')).getTime() + daySeconds;

    this.dateValid();
  }

  dateValid() {
    if (this.subscribed != '' && this.dateTo != '' && this.subscribed > this.dateTo) {
      alert("Please ensure that the Date to is greater than or equal to the Date from.");
      this.filtersForm.controls.dateTo.reset('');
      return false;
    }
  }

  downloadEXCEL() {
    let excelData = [];

    this.logs.forEach(e => {
      var Data =
      {
        'Guard Name': e.guardName,
        'Device Name': e.deviceName,
        'Gate Name': e.gateName,
        'Lane Name': e.laneName,
        'Date': e.creationDate,
        'Is Correct': (e.actualResult == true ? "Yes" : "No"),
        'Config Weapon Type': e.configWeaponType,
        'Config Threat Type': e.configThreatType,
        'Config Threat Location': e.configThreatLocation,
        'Log Weapon Type': e.logWeaponType,
        'Log Threat Type': e.logThreatType,
        'Log Threat Location': e.logThreatLocation,
        'Note': e.note
      };
      excelData.push(Data);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    var wscols = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 50 }
    ];

    ws['!cols'] = wscols;
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'BetaTestModeReport.xlsx');
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onScreenClose() {
    this.router.navigate(['/admin/reports/analyticdatareport'])
  }

  onPaginateChange(event) {
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    this.pageFrom = (pageIndex == 0 ? 0 : pageIndex * pageSize);
    this.pageTo = this.pageFrom + pageSize;

    this.showReport("paginator");
    // this.applyFilters();
  }
}