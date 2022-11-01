import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from '../../../../assets/services/report.service';
import { IWeaponDetected } from '../../../../assets/interfaces/ireports';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

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
  selector: 'app-datewise',
  templateUrl: './datewise.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss', './datewise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class DatewiseComponent implements OnInit {
  users: IWeaponDetected[] = [];

  displayedColumns: string[] = ['threatDate', 'handgun', 'rifle', 'pipeBomb', 'knife', 'threat', 'anomaly'];
  dataSource: MatTableDataSource<IWeaponDetected>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IWeaponDetected>(true, []);

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
  isEnabled: boolean = false;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

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
    this.reportService.getDatewise(this.fromDate, this.toDate).subscribe(res => {
      this.spinnerService.hide();
      this.users = res;//["data"];

      if (this.users.length == 0) {
        $("#showdata").show();
        $("#showdata").prev().hide();
      }
      else {
        $("#showdata").hide();
        $("#showdata").prev().show();
      }
      this.filterDeployments();
      this.isEnabled = true;
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sortingDataAccessor = (item, property) => {
      // switch (property) {
      //   case 'expiryDate': return new Date(item.threatDate);
      //   default: return item[property];
      // }
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
    this.reportService.getDatewise(this.fromDate, this.toDate).subscribe(res => {
      this.users = ActivityConstants.arraySortByKey(res, "threatDate");
      let doc = new jsPDF('p', 'pt');

      doc.text(40, 20, 'Threats by Date Report');
      doc.text(40, 45, 'Date From : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'));
      doc.text(40, 65, 'Date To     : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy'));
      let col = ["THREAT OCCURRENCE", "HANDGUN", "RIFLE", "PIPE BOMB", "KNIFE", "THREAT", "ANOMALY"];
      let rows = [];

      this.users.forEach(e => {
        let tmpRow = [(this.datePipe.transform(e.threatDate, 'MM/dd/yyyy')), (e.handgun == null ? "" : e.handgun), (e.rifle == null ? "" : e.rifle), (e.pipeBomb == null ? "" : e.pipeBomb), (e.knife == null ? "" : e.knife), (e.threat == null ? "" : e.threat), ((e.anomaly != null) ? e.anomaly : "")]
        rows.push(tmpRow);
      });

      doc.autoTable(col, rows, {
        styles: {},
        margin: { top: 80 }
      });

      doc.save('DatewiseReport.pdf');
    })
  }
}