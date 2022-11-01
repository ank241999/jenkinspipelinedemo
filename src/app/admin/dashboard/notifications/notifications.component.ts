import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ThreatActivityService } from '../../../../assets/services/threat-activity.service';
import { IActivityMonitoring, OldActivityMonitoring } from '../../../../assets/interfaces/iactivity-monitoring';
import { IActivity, Activity } from '../../../../assets/interfaces/iactivity';
import { Router } from '@angular/router';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { LaneDeviceService } from '../../../../assets/services/lanedevice.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { IDevice } from '../../../../assets/interfaces/idevice';
import { IActivityDashboard, ActivityDashboard } from '../../../../assets/interfaces/iactivitydashboard';
import { timer } from 'rxjs/observable/timer';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DevicedetailsComponent } from '../devicedetails/devicedetails.component';
import { ThreaticondetailsComponent } from '../threaticondetails/threaticondetails.component';
import { Location } from '@angular/common';
import { NotificationsMenuService } from '../../../core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],


})
export class NotificationsComponent implements OnInit {
  iactivity: IActivity[] = [];
  filteredActivities: IActivity[] = [];
  threatIds: string[] = [];

  dataSourceThreats: MatTableDataSource<IActivity>;
  @ViewChild(MatPaginator, { static: false }) paginatorThreats: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortThreats: MatSort;
  displayedColumnsThreats = [
    'threatIcon',
    'creationTimestamp',
    'time',
    'entranceName',
    'laneName',
    'guardName',
    'tabletId',
    'timeIn',
    'timeOut',
    'view'
  ];

  acms: IActivityMonitoring[] = [];
  status: string = "Ok";
  threatType: string = "No";
  date: string = "";
  time: string = "";
  threatIcon: string = "";
  gate: string = "";
  lane: string = "";
  selectedThreatStatusImage: string = "";

  constructor(
    private router: Router,
    private location: Location,
    private threatActivityService: ThreatActivityService,
    private shareDataService: ShareDataService,
    private notificationsMenuService: NotificationsMenuService,
    private spinnerService: Ng4LoadingSpinnerService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.threatActivityService.getThreatActivities("").subscribe(res => {
      var activitydata: OldActivityMonitoring = res['data'];
      //console.log(JSON.stringify(this.acms))
      for (var i in activitydata) {
        let iact: IActivity = this.addThreats("", "", activitydata[i], false);
        this.iactivity.push(iact);
        this.threatIds.push(this.acms[i].id);
      }

      // this.setDashboardSource();
      this.filterDeployments('');
      if (this.acms.length > 0)
        this.setThreatIsViewedStatus();
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  ngOnInit() {
  }

  filterDeployments(filter: string) {
    setTimeout(() => {
      this.dataSourceThreats = new MatTableDataSource<IActivity>(this.iactivity);
      this.dataSourceThreats.paginator = this.paginatorThreats;
      this.dataSourceThreats.sort = this.sortThreats;
    }, 0);
  }

  addThreats(contextFront, context, acm: OldActivityMonitoring, showThreat: boolean) {
    this.date = this.format(parseInt(acm.creationTimestamp), 'MM/dd/yyyy');
    this.time = this.format(parseInt(acm.creationTimestamp), 'HH:mm');
    acm.timeIn = this.format((acm.timeIn == null ? 0 : acm.timeIn), 'HH:mm');
    acm.timeOut = this.format((acm.timeOut == null ? 0 : acm.timeOut), 'HH:mm');

    this.status = "--";
    this.threatType = "--";
    this.gate = "";
    this.lane = "";

    let recentactivitythreat: IActivityMonitoring;
    recentactivitythreat = {
      "noThreatConfig": "",
      "objectDetected": true,
      "devices": [],
      "anomalies": {
        "cellphone": [],
        "keys": [],
        "genericAnomaly": []
      },
      "threats": {
        "handgun": [],
        "rifle": [],
        "pipeBomb": [],
        "knife": [],
        "genericThreat": []
      },
      "personsScannedId": []
    };
    recentactivitythreat.id = acm.id;
    recentactivitythreat.noThreatConfig = acm.noThreatConfig;
    recentactivitythreat.creationTime = acm.creationTime;
    recentactivitythreat.creationTimestamp = acm.creationTimestamp;
    recentactivitythreat.devices.push(acm.leftDeviceMacAddress);
    recentactivitythreat.devices.push(acm.rightDeviceMacAddress);
    recentactivitythreat.logId = acm.logId;
    recentactivitythreat.actualResult = acm.actualResult;
    recentactivitythreat.timeIn = acm.timeIn;
    recentactivitythreat.timeOut = acm.timeOut;

    //fulldisplay
    if (acm.noThreatConfig != undefined) {
      if (acm.noObjects != undefined && acm.noObjects == false) {
        this.status = ActivityConstants.statusOk;
        this.threatType = ActivityConstants.threatNoObject;
        this.threatIcon = ActivityConstants.smallNoThreatIcon;
        recentactivitythreat.objectDetected = false;
      }
      else {
        //cellphone
        if (acm.nonThreatCellphone != undefined && acm.nonThreatCellphone != "" && acm.nonThreatCellphone != "null") {
          recentactivitythreat.anomalies.cellphone = acm.nonThreatCellphone.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.nonThreatCellphone.split(","), ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatCellphone);
        }

        //keys
        if (acm.nonThreatKeys != undefined && acm.nonThreatKeys != "" && acm.nonThreatKeys != "null") {
          recentactivitythreat.anomalies.keys = acm.nonThreatKeys.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.nonThreatKeys.split(","), ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatCellphone);
        }

        //anomalies
        if (acm.anomaly != undefined && acm.anomaly != "" && acm.anomaly != "null") {
          this.status = ActivityConstants.statusAnomalies;
          this.threatType = ActivityConstants.threatAnomaly;
          this.threatIcon = ActivityConstants.smallAnomalyIcon;
          recentactivitythreat.anomalies.genericAnomaly = acm.anomaly.split(",");
        }

        //Handgun
        if (acm.threatHandgun != undefined && acm.threatHandgun != "" && acm.threatHandgun != "null") {
          recentactivitythreat.threats.handgun = acm.threatHandgun.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatHandgun.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatHandgun);
        }

        //Rifle
        if (acm.threatRifle != undefined && acm.threatRifle != "" && acm.threatRifle != "null") {
          recentactivitythreat.threats.rifle = acm.threatRifle.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatRifle.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatRifle);
        }

        //pipes
        if (acm.threatPipeBomb != undefined && acm.threatPipeBomb != "" && acm.threatPipeBomb != "null") {
          recentactivitythreat.threats.pipeBomb = acm.threatPipeBomb.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatPipeBomb.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatPipebomb);
        }

        //knife
        if (acm.threatKnife != undefined && acm.threatKnife != "" && acm.threatKnife != "null") {
          recentactivitythreat.threats.knife = acm.threatKnife.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatKnife.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatKnife);
        }

        //Threat
        if (acm.threatThreat != undefined && acm.threatThreat != "" && acm.threatThreat != "null") {
          recentactivitythreat.threats.genericThreat = acm.threatThreat.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatThreat.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatThreat);
        }
      }
    }

    this.acms.push(recentactivitythreat);

    let iact: Activity = new Activity(acm.id, this.status, this.time, this.threatIcon, acm.creationTimestamp, this.threatType,
      null, null, null, acm.deviceName, acm.laneName, acm.gateName,
      acm.timeIn, acm.timeOut, acm.tabletName, acm.userName, acm.tid);
    return iact;
  }

  showThreats(showThreat: boolean, contextFront, context, acm: IActivityMonitoring, threatLocation: string[],
    threat: string, statusThreat: string, smallThreatIcon: string, largeThreatIcon: string, threatType: string) {
    this.status = statusThreat;
    this.threatType = threatType;
    this.threatIcon = smallThreatIcon;
    this.selectedThreatStatusImage = largeThreatIcon;

    this.gate = "North Entrance";
    this.lane = "One";
  }

  viewThreat(row) {
    this.shareDataService.setSharedData(this.acms.filter(a => a.id == row.id)[0]);
    this.router.navigate(['./admin/activitymonitoring/activitythreats']);
  }

  format(time, format) {
    if (time != 0) {
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
  }

  onScreenClose() {
    this.router.navigate(['admin/dashboard']);
  }

  setThreatIsViewedStatus() {
    this.spinnerService.show();
    let obj = {
      ids: this.threatIds,
      viewedById: this.shareDataService.id
    };

    this.threatActivityService.setThreatViewed(obj).subscribe(res => {
      if (res['status'] == 201) {
        this.spinnerService.hide();

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification("Threat view status updated", 'top', 'center', '', 'info-circle');
        });
      }
      else if (res['status'] == 500) {
        this.spinnerService.hide();

        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          });
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      });
  }
}
