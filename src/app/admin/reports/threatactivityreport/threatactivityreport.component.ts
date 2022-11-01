import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from '../../../../assets/services/report.service';
import { IThreatActivity, IWeaponDetected } from '../../../../assets/interfaces/ireports';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as jsPDF from 'jspdf';
declare let jsPDF;

import 'jspdf-autotable';
import * as _moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
var $ = require('jquery');

const moment = _moment;

@Component({
  selector: 'app-threatactivityreport',
  templateUrl: './threatactivityreport.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})

export class ThreatActivityReportComponent implements OnInit {
  users: IThreatActivity[] = [];

  displayedColumns: string[] = ["creationTimestamp", "threatRifle", "threatHandgun", "threatPipeBomb", "threatKnife", "threatThreat", "anomaly"];
  dataSource: MatTableDataSource<IThreatActivity>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IThreatActivity>(true, []);

  filtersVisible = true;
  isBrowser: boolean;

  filtersForm: FormGroup;

  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateTo: string;
  reportContent: any;
  fromDate: number;
  toDate: number;
  isEnabled: boolean = false;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translate: TranslateService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    var LastDay = new Date(this.currYear, this.currMonth + 1, 0);
    this.isBrowser = isPlatformBrowser(platformId);
    this.filtersForm = fb.group({
      search: '',
      subscribed: new FormControl(moment([this.currYear, this.currMonth - 1, this.currentDate.getDate()])),
      dateTo: new FormControl(moment([this.currYear, this.currMonth, this.currentDate.getDate()]))
    });

    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });
  }

  ngOnInit() {
    $("#showdata").prev().hide();
  }

  showReport() {
    this.spinnerService.show();
    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd 00:00:00')).getTime();
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd 23:59:59')).getTime();
    this.reportService.getThreatActivity(this.fromDate, this.toDate).subscribe(res => {
      this.users = res;

      if (this.users.length == 0) {
        $("#showdata").show();
        $("#showdata").prev().hide();
      }
      else {
        $("#showdata").hide();
        $("#showdata").prev().show()
      }

      this.users.forEach(element => {
        if ((element.nonThreatCellphone != null && element.nonThreatCellphone != "")
          || (element.nonThreatKeys != null && element.nonThreatKeys != "")) {
          element.anomaly = "true";
        }
        else if (element.anomaly != null && element.anomaly.toString() == "true") {
          element.anomaly = "true";
        }
        else {
          element.anomaly = "";
        }
      });

      this.filterDeployments('');
      this.spinnerService.hide();
      this.isEnabled = true;
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  filterDeployments(filter: string) {
    let filteredUsers: IThreatActivity[] = this.users.filter((threatActivity: IThreatActivity) => {
      const searchStr = (
        (threatActivity.threatRifle != null ? threatActivity.threatRifle : "") +
        (threatActivity.threatHandgun != null ? threatActivity.threatHandgun : "") +
        (threatActivity.threatPipeBomb != null ? threatActivity.threatPipeBomb : "") +
        (threatActivity.anomaly != null ? threatActivity.anomaly : "")).toLowerCase().trim();

      return searchStr.indexOf(filter.toLowerCase().trim()) !== -1;
    });

    this.dataSource = new MatTableDataSource(filteredUsers);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

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
    this.toDate = new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 23:59:59')).getTime() + daySeconds;
    this.dateValid();
  }

  dateValid() {
    if (this.subscribed != '' && this.dateTo != '' && this.subscribed > this.dateTo) {
      alert("Please ensure that the Date to is greater than or equal to the Date from.");
      this.filtersForm.controls.dateTo.reset('');
      return false;
    }
  }

  downloadPDF() {
    this.reportService.getThreatActivity(this.fromDate, this.toDate).subscribe(res => {
      this.users = ActivityConstants.arraySortByKey(res, "creationTimestamp")
      let doc = new jsPDF('p', 'pt');

      doc.text(40, 20, 'Threat activity report');
      doc.text(40, 45, 'Date From : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'));
      doc.text(40, 65, 'Date To     : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy'));
      let col = ["THREAT OCCURRENCE", "HANDGUN", "RIFLE", "PIPE BOMB", "KNIFE", "THREAT", "ANOMALY"];
      let rows = [];

      this.users.forEach(e => {
        let tmpRow = [(this.datePipe.transform(e.creationTimestamp, 'MM/dd/yyyy, HH:mm:ss')),
        (e.threatHandgun == null ? "" : e.threatHandgun),
        (e.threatRifle == null ? "" : e.threatRifle),
        (e.threatPipeBomb == null ? "" : e.threatPipeBomb),
        (e.threatKnife == null ? "" : e.threatKnife),
        (e.threatThreat == null ? "" : e.threatThreat),
        ((e.nonThreatCellphone != null && e.nonThreatCellphone != "") || (e.nonThreatKeys != null && e.nonThreatKeys != "") ? "true" : (e.anomaly != null) ? e.anomaly : "")]
        rows.push(tmpRow);
      });

      doc.autoTable(col, rows, {
        styles: {},
        margin: { top: 80 },

      });

      doc.save('ThreatactivityReport.pdf');
    })
  }
}