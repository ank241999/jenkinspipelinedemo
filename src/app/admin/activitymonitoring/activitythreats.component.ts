import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { Activity } from '../../../assets/interfaces/iactivity';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

var $ = require('jquery');

@Component({
  selector: 'app-activitythreats-page',
  templateUrl: './activitythreats.component.html',
  styleUrls: ['./styles/_forms-wizard.scss', './styles/activitythreats.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class ActivityThreatsComponent {
  acm: IActivityMonitoring = {};
  state: string = "NOT CONNECTED";

  status: string = "Ok";
  threatType: string = "No";
  date: string = "";
  time: string = "";

  threatDisplayImg: string = "";
  tmpthreatDisplayImg: string = "";

  threatIcon: string = "";
  selectedThreatStatusImage: string = "";
  timerFlag: boolean = false;

  @ViewChild('canvasfront', { static: false }) canvasRefFront: ElementRef;
  @ViewChild('canvasback', { static: false }) canvasRefBack: ElementRef;

  frontimage: string = '../../assets/images/frontview1.png';
  backimage: string = '../../assets/images/backview1.png';

  gate: string = "";
  lane: string = "";

  constructor(
    private threatActivityService: ThreatActivityService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);

    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.spinnerService.show();
    this.defaultSettings();
  }

  ngAfterViewInit() {
    this.acm = this.shareDataService.getSharedData();// JSON.parse(JSON.stringify({ "id": "1", "noThreatConfig": "Full display", "objectDetected": null, "threatHandgun": "left chest", "threatRifle": null, "threatPipeBomb": null, "anomaly": null, "anomalies.cellphone": null, "anomalies.keys": null, "threatStatus": null, "creationTimestamp": 1574746891070, "updateTimestamp": 1574746891070 }));
    this.showObjects(this.acm, true);
    this.spinnerService.hide();
  }

  addThreats(contextFront, context, acm: IActivityMonitoring, showThreat: boolean) {
    this.threatIcon = ActivityConstants.noImageIcon;
    this.date = this.format(parseInt(acm.creationTimestamp), 'MM/dd/yyyy');
    this.time = this.format(parseInt(acm.creationTimestamp), 'HH:mm');

    this.status = "--";
    this.threatType = "--";
    this.gate = "";
    this.lane = "";

    //fulldisplay
    if (acm.noThreatConfig != undefined) {
      if (acm.objectDetected != undefined && acm.objectDetected == false) {
        this.status = ActivityConstants.statusOk;
        this.threatType = ActivityConstants.threatNoObject;
        this.threatIcon = ActivityConstants.smallNoThreatIcon;
        this.selectedThreatStatusImage = ActivityConstants.largeNoThreatIcon;

        this.gate = "North Entrance";
        this.lane = "One";

        if (showThreat) {
          this.drawBorder(context, ActivityConstants.noThreat);
        }
      }
      else {
        //cellphone
        if (acm.anomalies.cellphone != undefined && acm.anomalies.cellphone.length > 0) {

          this.showThreats(showThreat, contextFront, context, acm, acm.anomalies.cellphone, ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatCellphone);

        }

        //keys
        if (acm.anomalies.keys != undefined && acm.anomalies.keys.length > 0) {

          this.showThreats(showThreat, contextFront, context, acm, acm.anomalies.keys, ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatKeys);

        }

        //anomalies
        // if (acm.anomaly != undefined) {
        //   if (acm.anomaly == true) {
        //     if (showThreat) {
        //       this.drawBorder(context, ActivityConstants.anomaly);
        //     }
        //   }
        // }

        //anomalies
        if (acm.anomalies.genericAnomaly != undefined && acm.anomalies.genericAnomaly.length > 0) {
          this.showThreats(showThreat, contextFront, context, acm, acm.anomalies.genericAnomaly, ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.anomaly);
        }

        //Handgun
        if (acm.threats.handgun != undefined && acm.threats.handgun.length > 0) {
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.handgun, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatHandgun);
        }

        //Knife
        if (acm.threats.knife != undefined && acm.threats.knife.length > 0) {
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.knife, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatKnife);
        }

        //Rifle
        if (acm.threats.rifle != undefined && acm.threats.rifle.length > 0) {
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.rifle, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatRifle);
        }

        //pipes
        if (acm.threats.pipeBomb != undefined && acm.threats.pipeBomb.length > 0) {
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.pipeBomb, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatPipebomb);
        }

        //threat
        if (acm.threats.genericThreat != undefined && acm.threats.genericThreat.length > 0) {
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.genericThreat, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatThreat);
        }
      }
    }

    let iact: Activity = new Activity(acm.id, this.status, this.time, this.threatIcon, acm.creationTimestamp, this.threatType);
    return iact;
  }

  showThreats(showThreat: boolean, contextFront, context, acm: IActivityMonitoring, threatLocationarray: string[],
    threat: string, statusThreat: string, smallThreatIcon: string, largeThreatIcon: string, threatType: string) {
    this.status = statusThreat;
    this.threatType = threatType;
    this.threatIcon = smallThreatIcon;
    this.selectedThreatStatusImage = largeThreatIcon;

    this.gate = "North Entrance";
    this.lane = "One";

    if (showThreat) {
      this.drawBorder(context, threat);
    }

    threatLocationarray.forEach(threatLocation => {
      threatLocation = threatLocation.toLocaleLowerCase();
      if (threatLocation != "") {
        if (threatLocation == ActivityConstants.leftChest || ActivityConstants.leftChest.replace(/\s/g, "").includes(threatLocation)) {
          //green
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 225, 150, threat);
          }
        }
        if (threatLocation == ActivityConstants.leftChestBack || ActivityConstants.leftChestBack.replace(/\s/g, "").includes(threatLocation)) {
          //green
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 70, 150, threat);
          }
        }

        if (threatLocation == ActivityConstants.rightChest || ActivityConstants.rightChest.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 70, 150, threat);
          }
        }
        if (threatLocation == ActivityConstants.rightChestBack || ActivityConstants.rightChestBack.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 215, 150, threat);
          }
        }

        if (threatLocation == ActivityConstants.leftSculpaBack || ActivityConstants.leftSculpaBack.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 85, 120, threat);
          }
        }
        if (threatLocation == ActivityConstants.leftSculpa || ActivityConstants.leftSculpa.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 205, 120, threat);
          }
        }

        if (threatLocation == ActivityConstants.rightSculpaBack || ActivityConstants.rightSculpaBack.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 185, 120, threat);
          }
        }
        if (threatLocation == ActivityConstants.rightSculpa || ActivityConstants.rightSculpa.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 85, 120, threat);
          }
        }

        if (threatLocation == ActivityConstants.centerBack || ActivityConstants.centerBack.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 145, 250, threat);
          }
        }
        if (threatLocation == ActivityConstants.centerLowerBack || ActivityConstants.centerLowerBack.replace(/\s/g, "").includes(threatLocation)) {
          //red //hand
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 145, 310, threat);
          }
        }
        if (threatLocation == ActivityConstants.abdomen || ActivityConstants.abdomen.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 145, 270, threat);
          }
        }
        if (threatLocation == ActivityConstants.abdomenBack || ActivityConstants.abdomenBack.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 145, 270, threat);
          }
        }

        if (threatLocation == ActivityConstants.leftThigh || ActivityConstants.leftThigh.replace(/\s/g, "").includes(threatLocation)) {
          //green
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 200, 500, threat);
          }
        }
        if (threatLocation == ActivityConstants.leftThighBack || ActivityConstants.leftThighBack.replace(/\s/g, "").includes(threatLocation)) {
          //green
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 95, 500, threat);
          }
        }

        if (threatLocation == ActivityConstants.rightThigh || ActivityConstants.rightThigh.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 95, 500, threat);
          }
        }
        if (threatLocation == ActivityConstants.rightThighBack || ActivityConstants.rightThighBack.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 185, 500, threat);
          }
        }

        if (threatLocation == ActivityConstants.leftBackPocket || ActivityConstants.leftBackPocket.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 100, 380, threat);
          }
        }
        if (threatLocation == ActivityConstants.leftFrontPocket || ActivityConstants.leftFrontPocket.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 185, 380, threat);
          }
        }
        if (threatLocation == ActivityConstants.rightBackPocket || ActivityConstants.rightBackPocket.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 175, 380, threat);
          }
        }
        if (threatLocation == ActivityConstants.rightFrontPocket || ActivityConstants.rightFrontPocket.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 105, 380, threat);
          }
        }
        if (threatLocation == ActivityConstants.leftHip || ActivityConstants.leftHip.replace(/\s/g, "").includes(threatLocation)) {
          //red //hand
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 90, 420, threat);
          }
        }
        if (threatLocation == ActivityConstants.leftHipFront || ActivityConstants.leftHipFront.replace(/\s/g, "").includes(threatLocation)) {
          //red //hand
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 195, 420, threat);
          }
        }

        if (threatLocation == ActivityConstants.rightHip || ActivityConstants.rightHip.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(context, 185, 420, threat);
          }
        }
        if (threatLocation == ActivityConstants.rightHipFront || ActivityConstants.rightHipFront.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 90, 420, threat);
          }
        }

        if (threatLocation == ActivityConstants.leftAnkle || ActivityConstants.leftAnkle.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 195, 770, threat);
          }
        }

        if (threatLocation == ActivityConstants.rightAnkle || ActivityConstants.rightAnkle.replace(/\s/g, "").includes(threatLocation)) {
          if (showThreat && acm.noThreatConfig.toLocaleLowerCase() == ActivityConstants.fullDisplay) {
            this.drawArc(contextFront, 100, 770, threat);
          }
        }
      }
    });
  }

  highlightActivity(id) {
    $(".threat-act").each(function () {
      $(this).parent().attr("style", "background: #fff; cursor: pointer");
    });

    //$("#img-"+id).attr("style", "background: #e0e0e0; cursor: pointer");
    $("#" + id).parent().attr("style", "background: #e0e0e0; cursor: pointer");
  }

  setContext(acm: IActivityMonitoring, canvas, context, bodyImage: string, showThreat: boolean, contextFront) {
    let source = new Image();
    source.crossOrigin = 'Anonymous';
    source.onload = () => {
      canvas.height = source.height;
      canvas.width = source.width;

      context.drawImage(source, 0, 0);
      if (showThreat)
        this.addThreats(contextFront, context, acm, true)

      //document.getElementById("linkImage").setAttribute("href", canvas.toDataURL());
    };
    source.src = bodyImage;
  }

  showObjects(acm: IActivityMonitoring, showThreat: boolean) {
    let cx = document.createElement("CANVAS");//Unit test purpose

    let canvasFront = (this.canvasRefFront == undefined ? cx : this.canvasRefFront.nativeElement);
    let contextFront = canvasFront.getContext('2d');

    let canvasBack = (this.canvasRefBack == undefined ? cx : this.canvasRefBack.nativeElement);
    let contextBack = canvasBack.getContext('2d');

    this.setContext(acm, canvasFront, contextFront, this.frontimage, false, null);
    this.setContext(acm, canvasBack, contextBack, this.backimage, showThreat, contextFront);
  }

  drawArc(context, xPos, yPos, threatType) {
    let source = new Image();
    source.crossOrigin = 'Anonymous';
    source.onload = () => {
      context.drawImage(source, xPos, yPos);
    };

    let borderImage: string = "";
    if (threatType == ActivityConstants.threat) {
      borderImage = ActivityConstants.threatActivityCircle;
    }
    // else if (threatType == ActivityConstants.noThreat) {
    //   borderImage = ActivityConstants.noThreatActivityCircle;
    // }
    else {
      borderImage = ActivityConstants.anomalyActivityCircle;
    }
    source.src = borderImage;
  }

  drawBorder(context, threatType) {
    if (threatType == ActivityConstants.threat) {
      $(".canvas_wrapper").attr("style", "border-color: #E01717;");
    }
    else if (threatType == ActivityConstants.noThreat) {
      $(".canvas_wrapper").attr("style", "border-color: #6CE017;");
    }
    else {
      $(".canvas_wrapper").attr("style", "border-color: #FFB100;");
    }
  }


  defaultSettings() {
    this.threatIcon = ActivityConstants.noImageIcon;
    this.selectedThreatStatusImage = ActivityConstants.noImageIcon;
    this.date = "--";
    this.time = "--";
    this.status = "--";
    this.threatType = "--";
  }

  format(time, format) {
    var t = new Date(time);
    var tf = function (i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    })
  }
  gotoDashboard() {
    this.location.back();
  }
}
