import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { IActivityMonitoring, ActivityMonitoringDate, OldActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { IActivity, Activity } from '../../../assets/interfaces/iactivity';
import { Router } from '@angular/router';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { LaneDeviceService } from '../../../assets/services/lanedevice.service';
import { EntranceService } from '../../../assets/services/entrance.service'

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DevicedetailsComponent } from './devicedetails/devicedetails.component';
import { ThreaticondetailsComponent } from './threaticondetails/threaticondetails.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { GuarddetailsComponent } from './guarddetails/guarddetails.component';
import { CommunicationService } from '../../../assets/services/communication-service';
import { NotificationsMenuService } from '../../core/top-navbar/notifications-menu/notifications-menu.service';
import { TranslateService } from '@ngx-translate/core';
import { IDashboardDetails, IDeviceDetails } from '../../../assets/interfaces/idashboarddetails';
import { timer } from 'rxjs/observable/timer';
import { NotificationService } from '../../../assets/services/notification.service';

var $ = require('jquery');

export interface Timeout {
  id: number;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  filteredActivities: IDashboardDetails[] = [];
  activityDashboardList: IDashboardDetails[] = [];

  dataSourceGate: MatTableDataSource<IDashboardDetails>;
  @ViewChild(MatPaginator, { static: false }) paginatorGate: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortGate: MatSort;
  displayedColumnsGate = [
    'laneName',

    'status',
    'threatIcon',
    'threatType',

    'leftDeviceName',
    'leftDeviceStatus',
    'leftdeviceactions',

    'rightDeviceName',
    'rightDeviceStatus',
    'rightdeviceactions',

    'userName'
  ];

  dashboardDetails: IDashboardDetails[];
  status: string = "Ok";
  threatType: string = "No";
  date: string = "";
  time: string = "";
  threatIcon: string = "";
  gate: string = "";
  lane: string = "";
  selectedThreatStatusImage: string = "";
  entrances = [];
  notificationCount: number = 0;
  activityMonitoringList: IActivityMonitoring[] = [];
  deviceActThreats: IActivityMonitoring[] = [];

  deviceNotificaions = [];
  timerFlag: boolean = false;

  constructor(public dialog: MatDialog,
    private threatActivityService: ThreatActivityService,
    private router: Router, private shareDataService: ShareDataService,
    private lanedeviceService: LaneDeviceService,
    private entranceService: EntranceService,
    private spinnerService: Ng4LoadingSpinnerService,
    private communicationService: CommunicationService,
    private translate: TranslateService,
    private notificationsMenuService: NotificationsMenuService,
    private notificationService: NotificationService) {
    localStorage.setItem("deviceNotificaions", "");
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
    this.spinnerService.show();
    // if (shareDataService.activityDashboardList != undefined) {
    //   this.activityDashboardList = shareDataService.activityDashboardList;
    //   this.filterDeployments(this.activityDashboardList);
    // }

    this.getResources();
    this.notificationCount = parseInt(localStorage.getItem("notificationCount"));

    this.communicationService.receivedFilter.subscribe((acm: Object) => {
      this.notificationCount = parseInt(localStorage.getItem("notificationCount"));

      let iact: IActivityMonitoring = acm;
      this.deviceNotificaions.push({ leftDeviceMacAddress: iact.devices[0] });
      localStorage.setItem("deviceNotificaions", JSON.stringify(this.deviceNotificaions));

      this.entrances = this.filterDistinctEntrances(this.dashboardDetails);
      this.filterDeployments(this.dashboardDetails);
    });
  }

  ngOnInit() {
    // this.communicationService.receivedFilter.subscribe((param: Object) => {
    // alert(JSON.stringify(param))
    // alert(JSON.stringify(this.notificationsMenuService.notifications.length));
    // });
  }

  getResources() {
    this.spinnerService.show();
    let deviceCount: number = 0;

    try {
      this.lanedeviceService.getDashboardDetails().subscribe(ent => {
        if (ent["status"] == "200") {
          this.dashboardDetails = ent["data"];
          if (this.dashboardDetails.length == 0) {
            this.spinnerService.hide();
          }

          this.dashboardDetails.forEach(ele => {
            this.lanedeviceService.getDeviceDetails(ele.leftDeviceMacAddress).subscribe(en => {
              deviceCount++;
              if (en["status"] == "200" && en["data"]["#result-set-1"].length > 0) {
                let e: IDeviceDetails = en["data"]["#result-set-1"][0];
                if (e != undefined) {
                  let activityMonitoring: IActivityMonitoring = this.convertoldtonewthreattype(e.anomaly, e.threat_id.toString(), e.no_objects,
                    e.no_threat_config, e.non_threat_cellphone, e.non_threat_keys, e.threat_handgun, e.threat_pipe_bomb, e.threat_knife, e.threat_threat, e.threat_rifle,
                    e.creation_timestamp.toString(), ele.leftDeviceMacAddress, e.is_viewed);
                  this.activityMonitoringList.push(activityMonitoring);

                  let act: IActivity = this.addThreats("", "", activityMonitoring, false);
                  ele.threatIcon = act.threatIcon;
                  ele.threatType = act.threatType;
                  ele.status = act.status;
                  ele.id = act.id;
                  ele.timestamp = e.creation_timestamp;
                  ele.time = this.format(e.creation_timestamp, 'HH:mm');
                  ele.guardName = e.user_name;
                }

                let e1: IDeviceDetails[] = en["data"]["#result-set-1"];
                if (e1 != undefined) {
                  e1.forEach(a => {
                    let deviceActThreat: IActivityMonitoring = this.convertoldtonewthreattype(a.anomaly, a.threat_id.toString(), a.no_objects,
                      a.no_threat_config, a.non_threat_cellphone, a.non_threat_keys, a.threat_handgun, a.threat_pipe_bomb, e.threat_knife, e.threat_threat, a.threat_rifle,
                      a.creation_timestamp.toString(), ele.leftDeviceMacAddress, a.is_viewed);
                    this.deviceActThreats.push(deviceActThreat);
                  });
                }
              }

              if (this.dashboardDetails.length == deviceCount) {
                this.timerFlag = true;
              }
            },
              err => {
                console.log("Error occurred: " + err.message);
              });
          });

          let source = timer(1000, 1000);
          let subscribe = source.subscribe(val => {
            if (this.timerFlag) {
              this.timerFlag = false;

              this.entrances = this.filterDistinctEntrances(this.dashboardDetails);
              this.filterDeployments(this.dashboardDetails);
              subscribe.unsubscribe();
            }
          });
        }
      },
        err => {
          console.log("Error occurred: " + err.message);
          this.spinnerService.hide();
        });
    }
    catch (e) {
      console.log(e);
      this.spinnerService.hide();
    }
  }

  filterDistinctEntrances(items) {
    let lookup = {};
    // let items = json.DATA;
    let result = [];
    let threatCount: number = 0;
    if (localStorage.getItem("deviceNotificaions") != undefined && localStorage.getItem("deviceNotificaions") != "") {
      this.deviceNotificaions = JSON.parse(localStorage.getItem("deviceNotificaions"));
    }

    for (var item, i = 0; item = items[i++];) {
      let id = item.entranceID;

      if (!(id in lookup) && id != null) {
        threatCount = 0;
        threatCount = this.deviceNotificaions.filter(x => x.leftDeviceMacAddress == item.leftDeviceMacAddress).length;

        if (threatCount > 0 && threatCount % 2 == 0) {
          threatCount = threatCount / 2;
        }

        threatCount = threatCount + this.deviceActThreats.filter(x => x.devices[0] == item.leftDeviceMacAddress && (x.is_viewed == false || x.is_viewed == null)).length; //items.filter(t => t.entranceID == item.entranceID).length;

        lookup[id] = 1;
        result.push({ entranceId: item.entranceID, entranceName: item.entranceName, totalThreats: threatCount });
      }
    }

    return result;
  }

  filterDeployments(activityDashboardList: IDashboardDetails[]) {
    setTimeout(() => {
      this.dataSourceGate = new MatTableDataSource<IDashboardDetails>(activityDashboardList);
      this.dataSourceGate.paginator = this.paginatorGate;
      this.dataSourceGate.sort = this.sortGate;

      this.spinnerService.hide();
    }, 0);
  }

  filterContent(id: number) {
    this.filterDeployments(this.dashboardDetails.filter(a => a.entranceID == id));
  }

  addThreats(contextFront, context, acm: OldActivityMonitoring, showThreat: boolean) {
    this.threatIcon = ActivityConstants.noImageIcon;
    this.date = this.format(acm.creationTimestamp, 'MM/dd/yyyy');
    this.time = this.format(acm.creationTimestamp, 'HH:mm');

    this.status = "--";
    this.threatType = "--";
    this.gate = "";
    this.lane = "";

    //fulldisplay
    if (acm.noThreatConfig != undefined) {
      if (acm.noObjects != undefined && acm.noObjects == false) {
        this.status = ActivityConstants.statusOk;
        this.threatType = ActivityConstants.threatNoObject;
        this.threatIcon = ActivityConstants.smallNoThreatIcon;
        this.selectedThreatStatusImage = ActivityConstants.largeNoThreatIcon;
      }
      else {
        //cellphone
        if (acm.nonThreatCellphone != undefined && acm.nonThreatCellphone != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.nonThreatCellphone.split(","), ActivityConstants.noThreat,
            ActivityConstants.statusOk, ActivityConstants.smallNoThreatIcon, ActivityConstants.largeNoThreatIcon, ActivityConstants.threatCellphone);
        }

        //keys
        if (acm.nonThreatKeys != undefined && acm.nonThreatKeys != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.nonThreatKeys.split(","), ActivityConstants.noThreat,
            ActivityConstants.statusOk, ActivityConstants.smallNoThreatIcon, ActivityConstants.largeNoThreatIcon, ActivityConstants.threatKeys);
        }

        //anomalies
        if (acm.anomaly != undefined && acm.anomaly != "") {
          this.status = ActivityConstants.statusAnomalies;
          this.threatType = ActivityConstants.threatAnomaly;
          this.threatIcon = ActivityConstants.smallAnomalyIcon;
          this.selectedThreatStatusImage = ActivityConstants.largeAnomalyIcon;
        }

        //Handgun
        if (acm.threatHandgun != undefined && acm.threatHandgun != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.threatHandgun.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatHandgun);
        }

        //Rifle
        if (acm.threatRifle != undefined && acm.threatRifle != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.threatRifle.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatRifle);
        }

        //pipes
        if (acm.threatPipeBomb != undefined && acm.threatPipeBomb != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.threatPipeBomb.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatPipebomb);
        }

        //knife
        if (acm.threatKnife != undefined && acm.threatKnife != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.threatKnife.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatKnife);
        }

        //threat
        if (acm.threatThreat != undefined && acm.threatThreat != "") {
          this.showThreats(showThreat, contextFront, context, acm, acm.threatThreat.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatThreat);
        }
      }
    }

    let iact: Activity = new Activity(acm.id, this.status, this.time, this.threatIcon, acm.creationTimestamp, this.threatType);
    return iact;
  }

  convertoldtonewthreattype(anomaly: string, id: string, objectDetected: boolean, noThreatConfig: string, nonThreatCellphone: string,
    nonThreatKeys: string, threatHandgun: string, threatPipeBomb: string, threatKnife: string, threatThreat: string, threatRifle: string,
    creationTimestamp: string, leftDeviceMacAddress?: string, is_viewed?: boolean) {
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
    recentactivitythreat.id = id;
    recentactivitythreat.noThreatConfig = noThreatConfig;
    recentactivitythreat.objectDetected = !objectDetected;
    recentactivitythreat.creationTimestamp = creationTimestamp;
    recentactivitythreat.devices.push(leftDeviceMacAddress);
    recentactivitythreat.is_viewed = is_viewed;
    recentactivitythreat.anomalies.cellphone = nonThreatCellphone.split(",");
    recentactivitythreat.anomalies.keys = nonThreatKeys.split(",");
    recentactivitythreat.anomalies.genericAnomaly = anomaly.split(",");
    recentactivitythreat.threats.handgun = threatHandgun.split(",");
    recentactivitythreat.threats.rifle = threatRifle.split(",");
    recentactivitythreat.threats.pipeBomb = threatPipeBomb.split(",");
    recentactivitythreat.threats.knife = threatKnife.split(",");
    recentactivitythreat.threats.genericThreat = threatThreat.split(",");

    return recentactivitythreat;
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
    this.setThreatIsViewedStatus(row);
    let actObj: IActivityMonitoring[] = this.activityMonitoringList.filter(a => a.id == row.id.toString());
    if (actObj.length > 0) {
      this.shareDataService.setSharedData(actObj[0]);
      this.router.navigate(['./admin/activitymonitoring/activitythreats']);
    }
  }

  showthreatIconDetails(row) {
    let actObj: IActivityMonitoring[] = this.activityMonitoringList.filter(a => a.id == row.id.toString());
    if (actObj.length > 0) {
      this.shareDataService.setSharedData(actObj[0]);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = row;
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = "custom-threatIconPopup";
      // dialogConfig.hasBackdrop = false

      let dialogRef = this.dialog.open(ThreaticondetailsComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }
  }

  openDeviceDetailDialog(side) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = side;
    let dialogRef = this.dialog.open(DevicedetailsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  showAddRemoveGuardList(id) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "custom-guardDetails";
    // dialogConfig.hasBackdrop = false

    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = $("#" + id);

    // let dialogRef = this.dialog.open(GuarddetailsComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   this.ngOnInit();
    //   //this.positionUpdate();    
    // });
  }

  onManageLanes() {
    this.router.navigateByUrl('/admin/tablettohexwave');
  }

  onManageGates() {
    this.router.navigateByUrl('/admin/hexwavetogate/viewmap')
  }

  showNotifications() {
    //this.notifications = [];
    this.notificationCount = 0;
    localStorage.setItem("notificationCount", "0");
    localStorage.setItem("deviceNotificaions", "");
    this.router.navigateByUrl('/admin/dashboard/notifications');
  }

  onDeviceDetails(row) {
    this.router.navigate(['./admin/dashboard/threatdetails'], { queryParams: { leftDeviceMacAddress: row.leftDeviceMacAddress } });
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
    });
  }

  setThreatIsViewedStatus(row) {
    this.spinnerService.show();
    let threatIds: number[] = [];

    this.lanedeviceService.getDeviceDetails(row.leftDeviceMacAddress).subscribe(ent => {
      if (ent["status"] == "200") {
        let threatIcon = ActivityConstants.noImageIcon;
        let threatType = "--";
        let dvDetails: IDeviceDetails[] = ent["data"]["#result-set-1"];

        dvDetails.forEach(e => {
          threatIds.push(e.threat_id);
        });

        let obj = {
          ids: threatIds,
          viewedById: this.shareDataService.id
        };

        if (!obj.ids.length) {
          this.notificationService.showNotification("No Data Available", 'top', 'center', '', 'info-circle');
          this.spinnerService.hide();
          return;
        }

        this.threatActivityService.setThreatViewed(obj).subscribe(res => {
          if (res['status'] == 201) {
            this.spinnerService.hide();

            // this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
            //   this.notificationService.showNotification("Threat view status updated", 'top', 'center', '', 'info-circle');
            // });
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
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }
}