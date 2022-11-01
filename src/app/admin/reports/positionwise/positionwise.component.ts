import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from '../../../../assets/services/report.service';
import { IWeaponDetected } from '../../../../assets/interfaces/ireports';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
declare let jsPDF;
import 'jspdf-autotable';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { TranslateService } from '@ngx-translate/core';
var $ = require('jquery');

@Component({
  selector: 'app-positionwise',
  templateUrl: './positionwise.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss', './positionwise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class PositionwiseComponent implements OnInit {
  users: IWeaponDetected[] = [];

  displayedColumns: string[] = ['threatPosition', 'handgun', 'rifle', 'pipeBomb', 'knife', 'threat', 'anomaly'];
  dataSource: MatTableDataSource<IWeaponDetected>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IWeaponDetected>(true, []);

  filtersVisible = true;
  isBrowser: boolean;
  reportContent: any;
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

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.isBrowser = isPlatformBrowser(platformId);
    this.filtersForm = fb.group({
      search: '',
      subscribed: '',
      dateTo: ''
    });

    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });
  }

  ngOnInit() {
    this.spinnerService.show();
    $("#showdata").prev().hide();
    this.reportService.getPositionwise(null, null).subscribe(res => {
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
    },
      err => {
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
    const subscribed = form.subscribed;
    const dateTo = form.dateTo;

    const results = [];
    this.users.forEach(row => {
      const filter_date = this.datePipe.transform(subscribed, 'yyyy-MM-dd');
      const to_date = this.datePipe.transform(dateTo, 'yyyy-MM-dd');
      if ((subscribed === '' && dateTo === '') || (new Date(filter_date) <= new Date(row.threatDate) && new Date(dateTo) >= new Date(row.threatDate))
      ) {
        results.push(row);
      }
    });
    this.dataSource.data = results;
  }

  downloadPDF() {
    this.reportService.getPositionwise(null, null).subscribe(res => {
      this.users = ActivityConstants.arraySortByKey(res, "threatPosition", "asc");
      let doc = new jsPDF('p', 'pt');

      doc.text(40, 20, 'Threats by Location Report');

      let col = ["THREAT POSITION", "HANDGUN", "RIFLE", "PIPE BOMB", "KNIFE", "THREAT", "ANOMALY"];
      let rows = [];

      this.users.forEach(e => {
        let tmpRow = [(e.threatPosition == null ? "" : e.threatPosition), (e.handgun == null ? "" : e.handgun), (e.rifle == null ? "" : e.rifle), (e.pipeBomb == null ? "" : e.pipeBomb), (e.knife == null ? "" : e.knife), (e.threat == null ? "" : e.threat), ((e.anomaly != null) ? e.anomaly : "")]
        rows.push(tmpRow);
      });

      doc.autoTable(col, rows, {
        styles: {},
        margin: { top: 30 },

      });

      doc.save('positionwiseReport.pdf');
    })
  }

  // toCamelCase(str) {
  //   return str
  //     // .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
  //     // .replace(/\s/g, '')
  //     .replace(/^(.)/, function ($1) { return $1.toUpperCase(); });
  // }
}