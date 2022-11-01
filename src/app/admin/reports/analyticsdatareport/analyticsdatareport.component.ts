import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from 'chart.js';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IAnalyticReport } from '../../../../assets/interfaces/ireports';
import { ReportService } from '../../../../assets/services/report.service';
import * as pluginLabels from 'chartjs-plugin-labels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analyticsdatareport',
  templateUrl: './analyticsdatareport.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss', '../styles/report-chart.css', './analyticsdatareport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, NgbCarouselConfig]
})
export class AnalyticsdatareportComponent implements OnInit {

  @ViewChild('content', { 'static': true }) content: ElementRef;

  threatLocations = [
    { id: "1", value: "Left chest front", name: "leftchestfront" },
    { id: "2", value: "Left chest back", name: "leftchestback" },
    { id: "3", value: "Right chest front", name: "rightchestfront" },
    { id: "4", value: "Right chest back", name: "rightchestback" },
    { id: "5", value: "Left scapula front", name: "leftscapulafront" },
    { id: "6", value: "Left scapula back", name: "leftscapulaback" },
    { id: "7", value: "Right scapula front", name: "rightscapulafront" },
    { id: "8", value: "Right scapula back", name: "rightscapulaback" },
    { id: "9", value: "Abdomen front", name: "abdomenfront" },
    { id: "10", value: "Abdomen back", name: "abdomenback" },
    { id: "11", value: "Center back", name: "centerback" },
    { id: "12", value: "Center lower back", name: "centerlowerback" },
    { id: "13", value: "Left thigh front", name: "leftthighfront" },
    { id: "14", value: "Left thigh back", name: "leftthighback" },
    { id: "15", value: "Right thigh front", name: "rightthighfront" },
    { id: "16", value: "Right thigh back", name: "rightthighback" },
    { id: "17", value: "Left front pocket", name: "leftfrontpocket" },
    { id: "18", value: "Left back pocket", name: "leftbackpocket" },
    { id: "19", value: "Right front pocket", name: "rightfrontpocket" },
    { id: "20", value: "Right back pocket", name: "rightbackpocket" },
    { id: "21", value: "Left hip front", name: "lefthipfront" },
    { id: "22", value: "Left hip back", name: "lefthipback" },
    { id: "23", value: "Right hip front", name: "righthipfront" },
    { id: "24", value: "Right hip back", name: "righthipback" },
    { id: "25", value: "Left Ankle", name: "leftAnkle" },
    { id: "26", value: "Right Ankle", name: "rightAnkle" }
  ];

  tabularReportFilters = {
    threatType: "",
    weapon: "",
    location: "",
    isCorrect: "",
    dateFrom: "",
    dateTo: "",
    incorrectRecordsBy: ""
  };

  allData: IAnalyticReport[];
  correctData: IAnalyticReport;
  incorrectData: IAnalyticReport;
  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      labels: {
        render: 'value',
        precision: 2
      }
    },
  };
  public pieChartPlugins = [pluginLabels];

  zeroData: IAnalyticReport = {
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

  isEnabled: boolean = false;

  filtersForm: FormGroup;
  showCorrectChart: boolean = false;
  showIncorrectChart: boolean = false;
  showcorrectThreatChart: boolean = false;
  showcorrectNonThreatChart: boolean = false;
  showincorrectThreatChart: boolean = false;
  showincorrectNonThreatChart: boolean = false;
  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  fromDate: Date;
  toDate: Date;
  showdata: string;
  // Pie

  correctChart2ndLayerLabels: string[] = ['Threat Type', 'Weapons', 'Locations'];
  correctChart2ndLayerData: number[] = [0, 0, 0];

  incorrectChart2ndLayerLabels: string[] = ['Threat Type', 'Weapons', 'Locations'];
  incorrectChart2ndLayerData: number[] = [0, 0, 0];

  correctThreatTypeChartLabels: string[] = ['Threat', 'Anomaly', 'No Threat'];
  correctThreatTypeChartData: number[] = [0, 0, 0];

  incorrectThreatTypeChartLabels: string[] = ['Threat', 'Anomaly', 'No Threat'];
  incorrectThreatTypeChartData: number[] = [0, 0, 0];

  correctWeaponsChartLabels: string[] = ['Handgun', 'Pipebomb', 'Rifle', 'Threat Threat', 'Knife', 'Cellphone', 'Keys'];
  correctWeaponsChartData: number[] = [0, 0, 0, 0, 0, 0, 0];

  incorrectWeaponsChartLabels: string[] = ['Handgun', 'Pipebomb', 'Rifle', 'Threat Threat', 'Knife', 'Cellphone', 'Keys'];
  incorrectWeaponsChartData: number[] = [0, 0, 0, 0, 0, 0, 0];

  correctAllLocationsChartLabels: string[];
  correctAllLocationsChartData: number[];

  incorrectAllLocationsChartLabels: string[];
  incorrectAllLocationsChartData: number[];

  constructor(private fb: FormBuilder, private router: Router, private shareDataService: ShareDataService, private translate: TranslateService, private spinnerService: Ng4LoadingSpinnerService, private datePipe: DatePipe, private reportService: ReportService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.fromDate = new Date(this.currYear, this.currMonth - 1, this.currentDate.getDate());
    this.toDate = new Date(this.currYear, this.currMonth, this.currentDate.getDate());
    this.getData();

    this.filtersForm = fb.group({
      search: '',
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      dateRange: new FormControl("")
    });

    this.filtersForm.controls["dateRange"].patchValue('Monthly');
    this.filtersForm.controls["dateFrom"].patchValue(this.fromDate);
    this.filtersForm.controls["dateTo"].patchValue(this.toDate);
  }

  ngOnInit() {
  }

  showReport() {
    this.spinnerService.show();
    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.dateFrom, 'yyyy-MM-dd 00:00:00'));
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd 23:59:59'));
    this.getData();
  }

  resetDatePicker(): void {
    this.filtersForm.controls.dateFrom.reset('');
  }

  resetDatePickerTo(): void {
    this.filtersForm.controls.dateTo.reset('');
  }

  changeRange(val) {
    if (val == 'Monthly') {
      this.fromDate = new Date(this.currYear, this.currMonth - 1, this.currentDate.getDate());
    }
    else if (val == 'Weekly') {
      this.fromDate = new Date(this.currYear, this.currMonth, this.currentDate.getDate() - 7);
    }
    else if (val == 'Daily') {
      this.fromDate = new Date(this.currYear, this.currMonth, this.currentDate.getDate() - 1);
    }
    this.filtersForm.controls["dateFrom"].patchValue(this.fromDate);
  }

  setLocationChartValue() {
    this.correctAllLocationsChartLabels = [];
    this.incorrectAllLocationsChartLabels = [];
    this.correctAllLocationsChartData = [];
    this.incorrectAllLocationsChartData = [];

    this.threatLocations.forEach(element => {
      if (this.correctData[element.name] > 0) {
        this.correctAllLocationsChartLabels.push(element.value);
        this.correctAllLocationsChartData.push(this.correctData[element.name]);
      }

      if (this.incorrectData[element.name] > 0) {
        this.incorrectAllLocationsChartLabels.push(element.value);
        this.incorrectAllLocationsChartData.push(this.incorrectData[element.name]);
      }
    });
  }

  getData() {
    let startDate: string = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd 00:00:00').toString();
    let endDate: string = this.datePipe.transform(this.toDate, 'yyyy-MM-dd 23:59:59').toString();
    this.reportService.getBetaTestModeReportList(startDate, endDate).subscribe(res => {
      this.allData = res;
      if (this.allData.length > 1) {
        this.correctData = this.allData.filter(a => a.isCorrect == true)[0];
        this.incorrectData = this.allData.filter(a => a.isCorrect == false)[0];
        this.setLocationChartValue();
        this.setChartValues();
        this.showdata = "showdata";
        this.isEnabled = true;
      }
      else if (this.allData.length == 1) {
        if (this.allData.filter(a => a.isCorrect == true)[0]) {
          this.correctData = this.allData.filter(a => a.isCorrect == true)[0];
        }
        else {
          this.correctData = this.zeroData;
        }

        if (this.allData.filter(a => a.isCorrect == false)[0]) {
          this.incorrectData = this.allData.filter(a => a.isCorrect == false)[0];
        }
        else {
          this.incorrectData = this.zeroData;
        }
        this.setLocationChartValue();
        this.setChartValues();
        this.showdata = "showdata";
        this.isEnabled = true;
      }
      else {
        this.showdata = "nodata";
      }
      this.spinnerService.hide();
    })
  }

  setChartValues() {
    this.correctChart2ndLayerData = [this.correctData.threatTypes, this.correctData.weapons, this.correctData.locations];
    this.correctThreatTypeChartData = [this.correctData.totalThreat, this.correctData.totalAnomaly, this.correctData.totalNoThreat];
    this.correctWeaponsChartData = [this.correctData.totalHandgun, this.correctData.totalPipeBomb, this.correctData.totalRifle, this.correctData.totalThreatThreat, this.correctData.totalKnife, this.correctData.totalCellphone, this.correctData.totalKeys];

    this.incorrectChart2ndLayerData = [this.incorrectData.threatTypes, this.incorrectData.weapons, this.incorrectData.locations];
    this.incorrectThreatTypeChartData = [this.incorrectData.totalThreat, this.incorrectData.totalAnomaly, this.incorrectData.totalNoThreat];
    this.incorrectWeaponsChartData = [this.incorrectData.totalHandgun, this.incorrectData.totalPipeBomb, this.incorrectData.totalRifle, this.incorrectData.totalThreatThreat, this.incorrectData.totalKnife, this.incorrectData.totalCellphone, this.incorrectData.totalKeys];
  }

  generatePDF() {
    const div = document.getElementById('content');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(div, options).then((canvas) => {
      var img = canvas.toDataURL("image/PNG");
      var doc = new jsPDF('l', 'mm', 'a4', 1);
      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const pdfWidth = 290;
      const pdfHeight = 150;
      doc.text(40, 20, 'Analytic Report');
      doc.text(40, 45, 'Date From : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'));
      doc.text(40, 65, 'Date To     : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy'));
      doc.addPage();
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((doc) => {
      doc.save('AnalyticReport.pdf');
    });
  }

  showTabularReport(e: any, isCorrect: any, type: any) {
    this.tabularReportFilters.dateFrom = this.filtersForm.value.dateFrom;
    this.tabularReportFilters.dateTo = this.filtersForm.value.dateTo;
    this.tabularReportFilters.isCorrect = isCorrect;
    this.tabularReportFilters.weapon = (type == "Weapon" ? e : "");
    this.tabularReportFilters.location = (type == "Location" ? e : "");
    this.tabularReportFilters.threatType = (type == "ThreatType" ? e : "");
    this.tabularReportFilters.incorrectRecordsBy = "all";
    if (e == "Locations" && isCorrect == false) {
      this.tabularReportFilters.incorrectRecordsBy = "locationWise";
    }
    if (e == "Weapons" && isCorrect == false) {
      this.tabularReportFilters.incorrectRecordsBy = "weaponWise";
    }
    if (e == "Threat Type" && isCorrect == false) {
      this.tabularReportFilters.incorrectRecordsBy = "threatTypeWise";
    }
    this.shareDataService.setSharedData(this.tabularReportFilters);
    this.router.navigate(['./admin/reports/betatestmodereport'], { queryParams: { correctResult: isCorrect } });
  }

}
