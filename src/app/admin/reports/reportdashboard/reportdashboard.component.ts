import { Component, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '../../../../assets/services/report.service';
import { IWeaponDetected, IThroughput } from '../../../../assets/interfaces/ireports';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ReportConstants } from '../../../../assets/constants/report-constants';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from 'chart.js';
import { Chart } from "chart.js";
import * as pluginLabels from 'chartjs-plugin-labels';

@Component({
  selector: 'app-reportdashboard',
  templateUrl: './reportdashboard.component.html',
  styleUrls: ['../styles/ng2-charts.scss', '../styles/report-chart.css', './reportdashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, NgbCarouselConfig]
})
export class ReportdashboardComponent implements OnInit {
  isBrowser: boolean;
  currentMonth: string = "";
  data: any = {};

  positionWise: IWeaponDetected[] = [];
  dateWise: IWeaponDetected[] = [];
  ithroughput: IThroughput[] = [];
  throughput: IWeaponDetected = {};

  locationThreats: number[] = [];
  lineChartColors = [];
  lineChartDatewiseLabels = [];
  reportpersonspecificthreatlabels = [];
  throughputData = [0];
  throughputLabels = [];

  anomalyData: number;

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      labels: {
        render: 'percentage',
        precision: 2
      }
    },
  };

  reportpersonspecificthreatoptions: ChartOptions = {
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

  reportData = ReportConstants.reportDataDefault;
  reportDataDatewise = ReportConstants.reportDataDatewiseDefault;
  lineChartLabels = ReportConstants.lineChartLabels;
  throughputChartLabels = ReportConstants.throughputChartLabels;
  doughNutChartColors = ReportConstants.doughNutChartColors;
  monthNames = ReportConstants.monthNames;
  reportThroughput = ReportConstants.reportThroughput;
  reportlinechartThroughput = ReportConstants.reportThroughput;
  reportpersonspecificthreat = ReportConstants.reportThroughput;
  reportpersonspecificthreatLabels = [];
  throughputColor = [ReportConstants.color3];

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private datePipe: DatePipe,
    route: ActivatedRoute,
    private translate: TranslateService,
    config: NgbCarouselConfig
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    // customize default values of carousels used by this component tree
    config.interval = environment.reportChartSliderInterval;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;

    this.data = route.snapshot.data['data'];

    this.isBrowser = isPlatformBrowser(platformId);
    this.currentMonth = this.translateMonthName(this.monthNames[new Date().getMonth()]);
  }

  private translateMonthName(month: string): string {
    let retVal: string = "";
    switch (month) {
      case "January":
        this.translate.get('txtJanuary').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "February":
        this.translate.get('txtFebruary').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "March":
        this.translate.get('txtMarch').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "April":
        this.translate.get('txtApril').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "May":
        this.translate.get('txtMay').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "June":
        this.translate.get('txtJune').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "July":
        this.translate.get('txtJuly').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "August":
        this.translate.get('txtAugust').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "September":
        this.translate.get('txtSeptember').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "Octomber":
        this.translate.get('txtOctomber').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "November":
        this.translate.get('txtNovember').subscribe((text: string) => {
          retVal = text;
        });
        break;
      case "December":
        this.translate.get('txtDecember').subscribe((text: string) => {
          retVal = text;
        });
        break;
    }

    return retVal;
  }

  ngOnInit() {
    this.threatsByLocation();
    this.threatsByDate();
    this.throughPut();
  }

  //Threats by location
  threatsByLocation() {
    this.reportService.getPositionwise(null, null).subscribe(res => {
      this.positionWise = res;

      this.reportData = [];
      this.anomalyData = 0;
      this.lineChartColors = [];
      this.lineChartColors.push(ReportConstants.color1);
      this.lineChartColors.push(ReportConstants.color2);
      this.lineChartColors.push(ReportConstants.color3);
      this.lineChartColors.push(ReportConstants.color4);
      this.lineChartColors.push(ReportConstants.color5);
      this.lineChartColors.push(ReportConstants.color6);
      this.lineChartColors.push(ReportConstants.color7);
      this.lineChartColors.push(ReportConstants.color8);
      this.lineChartColors.push(ReportConstants.color9);
      this.lineChartColors.push(ReportConstants.color10);
      this.lineChartColors.push(ReportConstants.color11);
      this.lineChartColors.push(ReportConstants.color12);
      this.lineChartColors.push(ReportConstants.color13);

      this.generateLinechartData(ActivityConstants.leftThigh);
      this.generateLinechartData(ActivityConstants.leftThighBack);
      this.generateLinechartData(ActivityConstants.leftChest);
      this.generateLinechartData(ActivityConstants.leftChestBack);
      this.generateLinechartData(ActivityConstants.rightThigh);
      this.generateLinechartData(ActivityConstants.rightThighBack);
      this.generateLinechartData(ActivityConstants.rightChest);
      this.generateLinechartData(ActivityConstants.rightChestBack);
      this.generateLinechartData(ActivityConstants.leftHip);
      this.generateLinechartData(ActivityConstants.leftHipFront);
      this.generateLinechartData(ActivityConstants.rightHip);
      this.generateLinechartData(ActivityConstants.rightHipFront);
      this.generateLinechartData(ActivityConstants.centerLowerBack);
      this.generateLinechartData(ActivityConstants.rightSculpa);
      this.generateLinechartData(ActivityConstants.rightSculpaBack);
      this.generateLinechartData(ActivityConstants.leftSculpa);
      this.generateLinechartData(ActivityConstants.leftSculpaBack);
      this.generateLinechartData(ActivityConstants.centerBack);
      this.generateLinechartData(ActivityConstants.abdomen);
      this.generateLinechartData(ActivityConstants.abdomenBack);
      this.generateLinechartData(ActivityConstants.rightBackPocket);
      this.generateLinechartData(ActivityConstants.rightFrontPocket);
      this.generateLinechartData(ActivityConstants.leftBackPocket);
      this.generateLinechartData(ActivityConstants.leftFrontPocket);
      this.generateLinechartData(ActivityConstants.rightAnkle);
      this.generateLinechartData(ActivityConstants.leftAnkle);
      this.generateLinechartData("noLocation");
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  generateLinechartData(threatLocation) {
    let position: IWeaponDetected[] = this.positionWise.filter(a => a.threatPosition.toLocaleLowerCase() == (threatLocation == "noLocation" ? "-" : threatLocation));
    if (position.length > 0) {
      this.locationThreats = [];
      this.locationThreats.push(position[0].handgun);
      this.locationThreats.push(position[0].rifle);
      this.locationThreats.push(position[0].pipeBomb);
      this.locationThreats.push(position[0].knife);
      this.locationThreats.push(position[0].threat);
      this.locationThreats.push(0);
      this.anomalyData = this.anomalyData + position[0].anomaly;

      // this.locationThreats.push(position[0].anomaly);
      // this.locationThreats.push(position[0].cellphone);
      // this.locationThreats.push(position[0].keys);
      // this.locationThreats.push(position[0].anomaly + position[0].cellphone + position[0].keys);
      if (threatLocation != "noLocation")
        this.reportData.push({ "data": this.locationThreats, "label": this.formatThreatLocation(threatLocation) });

      console.log("position label " + JSON.stringify(this.formatThreatLocation(threatLocation)));
    }
    else {
      this.locationThreats = [0, 0, 0, 0, 0, 0];
      if (threatLocation != "noLocation")
        this.reportData.push({ "data": this.locationThreats, "label": this.formatThreatLocation(threatLocation) });

      console.log("position label " + JSON.stringify(this.formatThreatLocation(threatLocation)));
    }

    if (threatLocation == "noLocation") {
      this.locationThreats = [];
      this.locationThreats.push(0);
      this.locationThreats.push(0);
      this.locationThreats.push(0);
      this.locationThreats.push(0);
      this.locationThreats.push(0);
      this.locationThreats.push(this.anomalyData);
      this.reportData.push({ "data": this.locationThreats, "label": "No Location" });
    }
  }

  //Threats by date
  threatsByDate() {
    let currentDate: Date = new Date();
    let lastDay = new Date(currentDate.getMonth(), currentDate.getMonth() + 1, 0);
    let dateFrom: number = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
    let dateTo: number = new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDay.getDate()).getTime();

    this.reportService.getDatewise(dateFrom, dateTo).subscribe(res => {
      this.dateWise = res;
      this.lineChartDatewiseLabels = [];
      let handGunThreats: number[] = [];
      let rifleThreats: number[] = [];
      let pipeBombThreats: number[] = [];
      let knifeThreats: number[] = [];
      let threatThreats: number[] = [];
      let anomalyThreats: number[] = [];
      let cellPhoneThreats: number[] = [];
      let keysThreats: number[] = [];

      for (var i = 0; i < this.dateWise.length; i++) {
        this.lineChartDatewiseLabels.push(this.datePipe.transform(this.dateWise[i].threatDate, 'MM/dd/yyyy'));
        let dateWise: IWeaponDetected[] = this.dateWise.filter(a => a.threatDate == this.dateWise[i].threatDate);
        if (dateWise.length > 0) {
          handGunThreats.push(this.dateWise[i].handgun);
          rifleThreats.push(this.dateWise[i].rifle);
          pipeBombThreats.push(this.dateWise[i].pipeBomb);
          knifeThreats.push(this.dateWise[i].knife);
          threatThreats.push(this.dateWise[i].threat);
          anomalyThreats.push(this.dateWise[i].anomaly);
          // cellPhoneThreats.push(this.dateWise[i].cellphone);
          // keysThreats.push(this.dateWise[i].keys);
          // anomalyThreats.push(this.dateWise[i].anomaly + this.dateWise[i].cellphone + this.dateWise[i].keys);
        }
      }

      this.reportDataDatewise = [];
      this.reportDataDatewise.push({ "data": handGunThreats, "label": ActivityConstants.threatHandgun });
      this.reportDataDatewise.push({ "data": rifleThreats, "label": ActivityConstants.threatRifle });
      this.reportDataDatewise.push({ "data": pipeBombThreats, "label": ActivityConstants.pipeBomblabel });
      this.reportDataDatewise.push({ "data": knifeThreats, "label": ActivityConstants.threatKnife });
      this.reportDataDatewise.push({ "data": threatThreats, "label": ActivityConstants.threatThreat });
      this.reportDataDatewise.push({ "data": anomalyThreats, "label": ActivityConstants.threatAnomaly });
      // this.reportDataDatewise.push({ "data": cellPhoneThreats, "label": ActivityConstants.threatCellphone });
      // this.reportDataDatewise.push({ "data": keysThreats, "label": ActivityConstants.threatKeys });
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  //Throughput
  throughPut() {
    let throughputScanned = [];

    this.reportService.getThroughput(null, null).subscribe(res => {
      this.reportThroughput = [];
      this.reportlinechartThroughput = [];
      this.reportpersonspecificthreat = [];
      this.ithroughput = res;
      this.ithroughput.sort(function (a, b) {
        let x = a.hour;
        let y = b.hour;
        let dateX: Date = new Date(a.date);
        let dateY: Date = new Date(b.date);

        if (x < y && dateX <= dateY) { return -1; }
        if (x > y && dateX >= dateY) { return 1; }
        return 0;
      });

      let totalperson = [];
      let totalscanned = [];

      for (var i = (this.ithroughput.length - 1), j = 0; i >= 0 && j < 6; i--, j++) {
        this.reportpersonspecificthreatLabels.push(this.datePipe.transform(this.ithroughput[i].date, 'MM/dd/yyyy') + " - " + this.ithroughput[i].hour + "(hh)");
        totalscanned.push(this.ithroughput[i].total);
        totalperson.push(this.ithroughput[i].totalpersons);

        throughputScanned.push(this.ithroughput[i].total);
        this.throughputLabels.push(this.datePipe.transform(this.ithroughput[i].date, 'MM/dd/yyyy') + " - " + this.ithroughput[i].hour + "(hh)");
        this.reportThroughput.push({ "data": [this.ithroughput[i].total], "label": this.datePipe.transform(this.ithroughput[i].date, 'MM/dd/yyyy') + " - " + this.ithroughput[i].hour + "(hh)" });
      }

      this.reportpersonspecificthreat.push({ "data": totalperson, "label": 'Total Scanned Persons' });
      this.reportpersonspecificthreat.push({ "data": totalscanned, "label": 'Total Threats' });
      this.reportlinechartThroughput.push({ "data": throughputScanned, "label": "Scanned" });
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  // events
  chartClicked(e: any): void {
    // console.log(e);
  }

  chartHovered(e: any): void {
    // console.log(e);    
  }

  formatThreatLocation(val) {
    let retVal: string = "";
    switch (val) {
      case ActivityConstants.leftThigh:
        retVal = "Left thigh front";
        break;
      case ActivityConstants.leftThighBack:
        retVal = "Left thigh back";
        break;
      case ActivityConstants.leftChest:
        retVal = "Left chest front";
        break;
      case ActivityConstants.leftChestBack:
        retVal = "Left chest back";
        break;
      case ActivityConstants.rightThigh:
        retVal = "Right thigh front";
        break;
      case ActivityConstants.rightThighBack:
        retVal = "Right thigh back";
        break;
      case ActivityConstants.rightChest:
        retVal = "Right chest front";
        break;
      case ActivityConstants.rightChestBack:
        retVal = "Right chest back";
        break;
      case ActivityConstants.leftHip:
        retVal = "Left hip back";
        break;
      case ActivityConstants.leftHipFront:
        retVal = "Left hip front";
        break;
      case ActivityConstants.rightHip:
        retVal = "Right hip back";
        break;
      case ActivityConstants.rightHipFront:
        retVal = "Right hip front";
        break;
      case ActivityConstants.centerLowerBack:
        retVal = "Center lower back";
        break;
      case ActivityConstants.rightSculpa:
        retVal = "Right scapula front";
        break;
      case ActivityConstants.rightSculpaBack:
        retVal = "Right scapula back";
        break;
      case ActivityConstants.leftSculpa:
        retVal = "Left scapula front";
        break;
      case ActivityConstants.leftSculpaBack:
        retVal = "Left scapula back";
        break;
      case ActivityConstants.centerBack:
        retVal = "Center back";
        break;
      case ActivityConstants.abdomen:
        retVal = "Abdomen front";
        break;
      case ActivityConstants.abdomenBack:
        retVal = "Abdomen back";
        break;
      case ActivityConstants.rightBackPocket:
        retVal = "Right back pocket";
        break;
      case ActivityConstants.rightFrontPocket:
        retVal = "Right front pocket";
        break;
      case ActivityConstants.leftBackPocket:
        retVal = "Left back pocket";
        break;
      case ActivityConstants.leftFrontPocket:
        retVal = "Left front pocket";
        break;
      case ActivityConstants.rightAnkle:
        retVal = "Right ankle";
        break;
      case ActivityConstants.leftAnkle:
        retVal = "Left ankle";
        break;
    }

    return retVal;
  }
}