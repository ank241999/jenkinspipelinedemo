import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from '../../../../assets/services/report.service';
import { IThroughput } from '../../../../assets/interfaces/ireports';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
declare let jsPDF;
import 'jspdf-autotable';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
var $ = require('jquery');

const moment = _moment;

@Component({
  selector: 'app-throughput',
  templateUrl: './throughput.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ThroughputComponent implements OnInit {
  users: IThroughput[] = [];

  displayedColumns: string[] = ['date', 'hour', 'total'];
  dataSource: MatTableDataSource<IThroughput>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IThroughput>(true, []);

  filtersVisible = true;
  isBrowser: boolean;

  filtersForm: FormGroup;

  data: any = {
    "pieChart": {
      "labels": ["USA", "Brazil", "India", "France", "UK", "Italy", "Spain"],
      "data": [500, 300, 200, 100, 100, 90, 80],
      "type": "pie",
      "colors": [{
        "backgroundColor": [
          "rgba(144, 19, 254, 1)",
          "rgba(0, 170, 255, 1)",
          "rgba(80, 227, 194, 1)",
          "#c787ff",
          "#bd0fe1",
          "#f6a623",
          "#b8e986"
        ]
      }]
    }
  };

  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateTo: string;

  reportContent: any;
  fromDate: number;
  toDate: number;
  totalthreatofperiod: number;
  isEnabled: boolean = false;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
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
    this.reportService.getThroughput(this.fromDate, this.toDate).subscribe(res => {
      this.users = res;
      
      this.users.forEach((element, index) => {
        this.users[index].date = this.transform(element.date);
      });

      if (this.users.length == 0) {
        $("#showdata").show();
        $("#showdata").prev().hide();
      }
      else {
        $("#showdata").hide();
        $("#showdata").prev().show();
      }
      this.filterDeployments();
      this.totalthreatofperiod = this.users.reduce((prev, next) => prev + next.total, 0)

      this.spinnerService.hide();
      this.isEnabled = true;
    }, err => {
      console.log("Error occurred: " + err.message);
      this.spinnerService.hide();
    });
  }
  
  transform(value: number): number {
    var d = new Date(value);
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(new Date(utc)).getTime();
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
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
    this.reportService.getThroughput(this.fromDate, this.toDate).subscribe(res => {
      this.users = ActivityConstants.arraySortByKey(res, "date");
      let doc = new jsPDF('p', 'pt');

      doc.text(40, 20, 'Throughput Report');
      doc.text(40, 45, 'Date From : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'));
      doc.text(40, 65, 'Date To     : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy'));
      let col = ["DATE", "TIME (hh)", "TOTAL SCANNED"];
      let rows = [];

      this.users.forEach(e => {
        let tmpRow = [(this.datePipe.transform(e.date, 'MM/dd/yyyy')), (e.hour == null ? "" : e.hour), (e.total == null ? "" : e.total)]
        rows.push(tmpRow);
      });

      doc.autoTable(col, rows, {
        styles: {},
        margin: { top: 80 },

      });
      
      let finalY = doc.lastAutoTable.finalY; // The y position on the page
      doc.text(40, finalY + 20, 'TOTAL SCANNED FROM ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy') + ' TO ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy') + ' : ' + this.totalthreatofperiod);

      doc.save('ThroughputReport.pdf');
    })
  }
}