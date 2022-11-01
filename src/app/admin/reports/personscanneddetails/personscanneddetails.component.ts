import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MatPaginator, MatSort, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import * as _moment from 'moment';
import { ReportService } from '../../../../assets/services/report.service';
import { IPersonScannedDetails } from '../../../../assets/interfaces/ireports';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
declare let jsPDF;
import 'jspdf-autotable';
var $ = require('jquery');

const moment = _moment;

@Component({
  selector: 'app-personscanneddetails',
  templateUrl: './personscanneddetails.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class PersonscanneddetailsComponent implements OnInit {
  users: IPersonScannedDetails[] = [];
  filtersVisible = true;
  displayedColumns: string[] = ['objectids', 'totalthreat', 'totalanomaly', 'totalnonthreat', 'totalnoobject', 'total'];
  dataSource: MatTableDataSource<IPersonScannedDetails>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  isBrowser: boolean;

  filtersForm: FormGroup;

  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateTo: string;
  fromDate: number;
  toDate: number;
  isEnabled: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.isBrowser = isPlatformBrowser(platformId);
    this.filtersForm = fb.group({
      search: '',
      subscribed: new FormControl(moment([this.currYear, this.currMonth, this.currentDate.getDate() - 1])),
      dateTo: new FormControl(moment([this.currYear, this.currMonth, this.currentDate.getDate()]))
    });

    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });
  }

  ngOnInit(): void {
    $("#showdata").prev().hide();
  }

  showReport() {
    this.spinnerService.show();
    let fromDate: string = "";
    let toDate: string = "";

    if (this.filtersForm.controls["subscribed"].value) {
      this.subscribed = this.filtersForm.value.subscribed;
      fromDate = this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00');//new Date(this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00')).getTime() - 1;
    }
    if (this.filtersForm.controls["dateTo"].value) {
      this.dateTo = this.filtersForm.value.dateTo;
      toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 23:59:59');//new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 00:00:00')).getTime() + daySeconds;
    }

    this.reportService.getPersonScannedDetail(fromDate.toString(), toDate.toString()).subscribe(res => {
      this.users = res;

      if (this.users.length == 0) {
        $("#showdata").show();
        $("#showdata").prev().hide();
      }
      else {
        $("#showdata").hide();
        $("#showdata").prev().show();
      }
      this.filterDeployments();

      this.spinnerService.hide();
      this.isEnabled = true;
    }, err => {
      console.log("Error occurred: " + err.message);
      this.spinnerService.hide();
    });
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
    let fromDate: string = "";
    let toDate: string = "";

    if (this.filtersForm.controls["subscribed"].value) {
      this.subscribed = this.filtersForm.value.subscribed;
      fromDate = this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00');//new Date(this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00')).getTime() - 1;
    }
    if (this.filtersForm.controls["dateTo"].value) {
      this.dateTo = this.filtersForm.value.dateTo;
      toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 23:59:59');//new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 00:00:00')).getTime() + daySeconds;
    }

    this.reportService.getPersonScannedDetail(fromDate.toString(), toDate.toString()).subscribe(res => {
      this.users = ActivityConstants.arraySortByKey(res, "date");
      let doc = new jsPDF('p', 'pt');

      doc.text(40, 20, 'Person Scanned Details Report');
      doc.text(40, 45, 'Date From : ' + this.datePipe.transform(this.subscribed, 'MM/dd/yyyy'));
      doc.text(40, 65, 'Date To     : ' + this.datePipe.transform(this.dateTo, 'MM/dd/yyyy'));
      let col = ['OBJECT IDS', 'TOTAL THREAT', 'TOTAL ANOMALY', 'TOTAL NON THREAT', 'TOTAL NO OBJECT', 'TOTAL'];
      let rows = [];

      this.users.forEach(e => {
        let tmpRow = [(e.objectids == null ? "" : e.objectids), (e.total_threat == null ? "" : e.total_threat), (e.total_anomaly == null ? "" : e.total_anomaly), (e.total_non_threat == null ? "" : e.total_non_threat), (e.total_noobject == null ? "" : e.total_noobject), (e.total == null ? "" : e.total)]
        rows.push(tmpRow);
      });

      doc.autoTable(col, rows, {
        styles: {},
        margin: { top: 80 },

      });

      doc.save('PersonScannedDetailsReport.pdf');
    });
  }

  downloadEXCEL() {
    let excelData = [];

    this.users.forEach(e => {
      var Data =
      {
        'OBJECT IDS': e.objectids,
        'TOTAL THREAT': e.total_threat,
        'TOTAL ANOMALY': e.total_anomaly,
        'TOTAL NON THREAT': e.total_non_threat,
        'TOTAL NO OBJECT': e.total_noobject,
        'TOTAL': e.total
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
    XLSX.writeFile(wb, 'PersonScannedDetailsReport.xlsx');
  }

}
