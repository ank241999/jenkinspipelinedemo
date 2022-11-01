import { Component, ViewEncapsulation, ViewChild, ElementRef, asNativeElements } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { IActivityMonitoring, OldActivityMonitoring, Logactualthreat } from '../../../assets/interfaces/iactivity-monitoring';
import { IActivity, Activity } from '../../../assets/interfaces/iactivity';
import { MessagingService } from '../../../assets/services/messaging.service';
import { Message } from "@stomp/stompjs";
import { StompState } from "@stomp/ng2-stompjs";
import { timer } from 'rxjs/observable/timer';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { Router } from '@angular/router';
import { UserService } from '../../../assets/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { IUserSetting } from '../../../assets/interfaces/iuser-setting';
import { NotificationService } from '../../../assets/services/notification.service';
import { environment } from '../../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddnoteComponent } from './addnote/addnote.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IThreatLog } from '../../../assets/interfaces/ithreatlog';
import { ThreatLogService } from '../../../assets/services/threatlog.service';
import { UserSettingService } from '../../../assets/services/userSettingService';
import { CommunicationService } from '../../../assets/services/communication-service';
import { LogdetailsComponent } from './logdetails/logdetails.component';
import { TabletService } from '../../../assets/services/tablet.service';
import { ITablet } from '../../../assets/interfaces/itablet';
import { DeviceDetectSimulatorService } from '../../../assets/services/device-detect-simulator.service';
import { IDeviceDetect } from '../../../assets/interfaces/idevicedetect';
import { ShareDataService } from '../../../assets/services/share-data.service';

var $ = require('jquery');

@Component({
  selector: 'app-activitymonitoring-page',
  templateUrl: './activitymonitoring.component.html',
  styleUrls: ['./styles/_forms-wizard.scss', './styles/activitymonitoring.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class ActivityMonitoringComponent {
  enableAddButton: number = 0;
  messageHistory = [];
  myVar: any;

  iactivity: IActivity[] = [];
  filteredActivities: IActivity[] = [];

  dataSource: MatTableDataSource<IActivity>;
  displayedColumns = [
    'status',
    'timestamp',
    'actualResult'
  ];

  logactualselectthreattype: string[] = [];

  acm: IActivityMonitoring = {};
  acms: IActivityMonitoring[] = [];
  state: string = "NOT CONNECTED";

  status: string = "Ok";
  threatType: string = "No";
  threatLocate: string = "";
  date: string = "";
  time: string = "";

  threatDisplayImg: string = "";
  tmpthreatDisplayImg: string = "";

  threatIcon: string = "";
  selectedThreatStatusImage: string = "";
  timerFlag: boolean = false;

  statusI: string = "Ok";
  threatTypeI: string = "No";
  threatIconI: string = "";
  selectedThreatStatusImageI: string = "";

  r_resultSelected: string = "";

  logPopHide: boolean = true;
  startInterval: any;
  stopThreat: boolean;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('filter', { static: false }) filter: ElementRef;
  @ViewChild('canvasfront', { static: false }) canvasRefFront: ElementRef;
  @ViewChild('canvasback', { static: false }) canvasRefBack: ElementRef;
  //image: string = '../../assets/images/DefaultBackgroundScreen.png';
  frontimage: string = '../../assets/images/frontview2.png';
  backimage: string = '../../assets/images/backview2.png';

  gate: string = "";
  lane: string = "";
  email: string;
  isThreatFlag: boolean = false;
  currentThreatId: string = "0";
  //isNonThreatFlag: boolean = false;
  //
  //logActualResult: boolean = false;
  //isStopThreat: boolean = false;
  betaTestMode: boolean;
  primaryGuardMode: boolean;
  primaryDevice: boolean;
  primaryTablet: boolean = false;

  form: FormGroup;
  formcontrol: FormControl;

  typeOfWeapon = [
    { item: "No weapon", value: "No weapon" },
    { item: "Handgun", value: "Handgun" },
    { item: "Rifle", value: "Rifle" },
    { item: "Pipe Bomb", value: "Pipebomb" },
    { item: "Knife", value: "Knife" },
    { item: "Threat", value: "Threat" },
    { item: "Generic Anomaly", value: "Generic Anomaly" },
    { item: "Cellphone", value: "Cellphone" },
    { item: "Keys", value: "Keys" }
  ];

  threatTypes = [
    { item: "Threat", value: "Threat" },
    { item: "Anomaly", value: "Anomaly" }
  ];

  threatLocations = [
    { item: "No location", value: "No location" },
    { item: "left chest", value: "Left chest front" },
    { item: "left chest", value: "Left chest back" },
    { item: "right chest", value: "Right chest front" },
    { item: "right chest", value: "Right chest back" },
    { item: "left scapula", value: "Left scapula front" },
    { item: "left scapula", value: "Left scapula back" },
    { item: "right scapula", value: "Right scapula front" },
    { item: "right scapula", value: "Right scapula back" },
    { item: "abdomen", value: "Abdomen front" },
    { item: "abdomen", value: "Abdomen back" },
    { item: "center back", value: "Center back" },
    { item: "center lower back", value: "Center lower back" },
    { item: "left thigh", value: "Left thigh front" },
    { item: "left thigh", value: "Left thigh back" },
    { item: "right thigh", value: "Right thigh front" },
    { item: "right thigh", value: "Right thigh back" },
    { item: "left back pocket", value: "Left back pocket front" },
    { item: "left back pocket", value: "Left back pocket back" },
    { item: "right back pocket", value: "Right back pocket front" },
    { item: "right back pocket", value: "Right back pocket back" },
    { item: "left hip", value: "Left hip front" },
    { item: "left hip", value: "Left hip back" },
    { item: "right hip", value: "Right hip front" },
    { item: "right hip", value: "Right hip back" },
    { item: "right ankle", value: "Right Ankle" },
    { item: "left ankle", value: "Left Ankle" }
  ];

  logactualthreat: Logactualthreat[] = [];
  logactualresultdata: Logactualthreat[] = [];
  rowwisedata: number[] = [];
  //

  constructor(private threatActivityService: ThreatActivityService,
    public tabletService: TabletService,
    private messagingService: MessagingService, private router: Router,
    private userService: UserService, private translate: TranslateService,
    private notificationService: NotificationService,
    public deviceDetectService: DeviceDetectSimulatorService,
    private spinnerService: Ng4LoadingSpinnerService, public dialog: MatDialog,
    public formBuilder: FormBuilder, private threatLogService: ThreatLogService,
    private userSettingService: UserSettingService,
    private shareDataService: ShareDataService,
    private communicationService: CommunicationService) {
    this.form = formBuilder.group({
      r_result: new FormControl(''),
      threatType: new FormControl(''),
      weaponType: new FormControl(''),
      threatLocation: new FormControl('')
    });

    translate.setDefaultLang(ActivityConstants.browserLanguage);
    $("#dv_rightpanel").height(window.innerHeight - 120);

    document.body.style.background = '#EBEBEB';
    this.spinnerService.show();

    //this.getThreatLogFlag();

    // Instantiate a messagingService
    // this.messagingService = new MessagingService();
    // Subscribe to its stream (to listen on messages)
    try {
      // this.messagingService.stream().subscribe((message: Message) => {
      if (this.communicationService.receivedFilter.observers == []) {
        this.spinnerService.hide();
      }

      this.communicationService.receivedFilter.subscribe((acm: Object) => {
        // if (message.body) {
        this.spinnerService.show();
        // this.messageHistory.unshift(message.body);
        // this.acm = JSON.parse(message.body);
        this.acm = acm;

        if (this.primaryDevice == false) {
          if (this.acms.filter(a => a.id == this.acm.id).length == 0) {
            this.acms.push(this.acm);
            //this.acms.push(acm);
            this.currentThreatId = this.acm.id;

            let iact: IActivityMonitoring = this.addThreats('', '', this.acm, false);
            this.iactivity.push(iact);

            if (!this.isThreatFlag) {
              this.filterDeployments('');
              this.showObjects(this.acm, true);

              if (this.betaTestMode.toString() == "true" && this.primaryTablet == true) {
                this.checkBetaTestMode(this.acm);
              }
              if (this.primaryGuardMode.toString() == "true" && this.primaryTablet == true) {
                //$("#dv_log").show();
                this.checkPrimaryGuardMode(this.acm);
              }
              //if (this.primaryGuardMode.toString() == "false") {
              //  let status: IDeviceDetect = {
              //    left_mac_address: acm['leftDeviceMacAddress'],
              //    right_mac_address: acm['rightDeviceMacAddress'],
              //   status: 'THREAT'
              // }
              // this.deviceDetectService.sendStatus(status).subscribe(res => {
              //   console.log(res);
              // },
              //   err => {
              //     console.log("Error occurred: " + err.message);
              //   })
              //}
            }

            this.timerFlag = true;
            this.spinnerService.hide();
          }
        }
        else {
          if (this.acms.filter(a => a.id == this.acm.id).length == 0 && (this.acms.filter(a => a.devices[0] == acm['devices'][0]).length > 0 || this.acms.filter(a => a.devices[1] == acm['devices'][1]).length > 0)) {
            this.acms.push(this.acm);
            //this.acms.push(acm);
            this.currentThreatId = this.acm.id;

            let iact: IActivityMonitoring = this.addThreats('', '', this.acm, false);
            this.iactivity.push(iact);

            if (!this.isThreatFlag) {
              this.filterDeployments('');
              this.showObjects(this.acm, true);

              if (this.betaTestMode.toString() == "true" && this.primaryTablet == true) {
                this.checkBetaTestMode(this.acm);
              }
              if (this.primaryGuardMode.toString() == "true" && this.primaryTablet == true) {
                //$("#dv_log").show();
                this.checkPrimaryGuardMode(this.acm);
              }
              //if (this.primaryGuardMode.toString() == "false") {
              //  let status: IDeviceDetect = {
              //    left_mac_address: acm['leftDeviceMacAddress'],
              //    right_mac_address: acm['rightDeviceMacAddress'],
              //    status: 'THREAT'
              //  }
              //  this.deviceDetectService.sendStatus(status).subscribe(res => {
              //    console.log(res);
              //  },
              //    err => {
              //      console.log("Error occurred: " + err.message);
              //    })
              //}
            }

            this.timerFlag = true;
            this.spinnerService.hide();
            // setTimeout(() => {
            //   this.highlightActivity(this.acm.id); translate.setDefaultLang(navigator.language);
            // }, 1000);
            // }
          }
        }
        this.spinnerService.hide();
      });

      // Subscribe to its state (to know its connected or not)
      // this.messagingService.state().subscribe((state: StompState) => {
      //   this.state = StompState[state];
      // });

      let source = timer(environment.timerInterval, environment.timerInterval);
      let subscribe = source.subscribe(val => {
        if (this.timerFlag) {
          setTimeout(() => {
            if (!this.isThreatFlag) {
              this.defaultSettings();
              this.showObjects({}, false);
              $(".canvas_wrapper").attr("style", "border-color: #fcfcfc;");

              $(".threat-act").each(function () {
                $(this).parent().attr("style", "background: #f8f8f8; cursor: pointer");
              });

              $("#dv_log").hide();
            }
          }, environment.timerThreatConfigInterval);
          this.timerFlag = false;
        }
      });

      // Subscribe to its state (to know its connected or not)
      this.messagingService.state().subscribe((state: StompState) => {
        this.state = StompState[state];
      });
    }
    catch (e) {
      console.log(e);
      this.spinnerService.hide();
    }
  }

  checkPrimaryGuardMode(iact: IActivityMonitoring) {
    // alert(JSON.stringify(iact))
    // alert("A: "+this.isThreatFlag)
    //$("#dv_log").show();
    this.setActivityInLogControls("", "");

    if (iact.threats.handgun != undefined && iact.threats.handgun.length > 0) {
      this.isThreatFlag = true;
      //this.setActivityInLogControls("Handgun", iact.threatHandgun);
    }
    else if (iact.threats.pipeBomb != undefined && iact.threats.pipeBomb.length > 0) {
      this.isThreatFlag = true;
      //this.setActivityInLogControls("Pipebomb", iact.threatPipeBomb);
    }
    else if (iact.threats.rifle != undefined && iact.threats.rifle.length > 0) {
      this.isThreatFlag = true;
      //this.setActivityInLogControls("Rifle", iact.threatRifle);
    }
    else if (iact.threats.knife != undefined && iact.threats.knife.length > 0) {
      this.isThreatFlag = true;
      //this.setActivityInLogControls("Rifle", iact.threatRifle);
    }
    else if (iact.threats.genericThreat != undefined && iact.threats.genericThreat.length > 0) {
      this.isThreatFlag = true;
      //this.setActivityInLogControls("Rifle", iact.threatRifle);
    }
    // else if (iact.nonThreatCellphone != undefined) {
    //   $("#dv_log").show();
    // }
    // else if (iact.nonThreatKeys != undefined) {
    //   $("#dv_log").show();
    // }
    // else if (iact.anomaly != undefined) {
    //   $("#dv_log").show();
    // }
    // else if (iact.noObjects != undefined) {
    //   $("#dv_log").show();
    // }

    // alert("B: "+this.isThreatFlag)

    if (this.isThreatFlag) {
      /*let status: IDeviceDetect = {
        left_mac_address: iact.leftDeviceMacAddress,
        right_mac_address: iact.rightDeviceMacAddress,
        status: 'THREAT_DISPLAY_START'
      }
      this.deviceDetectService.sendStatus(status).subscribe(res => {
        console.log(res);
      },
        err => {
          console.log("Error occurred: " + err.message);
        })*/
      this.sendDisplayStart(iact);
      $("#dv_recentActivity").hide();
      $("#dv_recentActivityThreat").show();
    }
    else {
      $("#dv_recentActivityThreat").hide();
      $("#dv_recentActivity").show();
    }

    console.log("this.isThreatFlag: " + this.isThreatFlag);

    this.stopCall();
  }

  checkBetaTestMode(iact: IActivityMonitoring) {
    $("#dv_log").show();
    this.setActivityInLogControls("", "");
    // if (iact.threatHandgun != undefined) {
    //   this.setActivityInLogControls("Handgun", iact.threatHandgun);
    // }
    // else if (iact.threatPipeBomb != undefined) {
    //   this.setActivityInLogControls("Pipebomb", iact.threatPipeBomb);
    // }
    // else if (iact.threatRifle != undefined) {
    //   this.setActivityInLogControls("Rifle", iact.threatRifle);
    // }
    // else if (iact.nonThreatCellphone != undefined) {
    //   this.setActivityInLogControls("Cellphone", iact.nonThreatCellphone);
    // }
    // else if (iact.nonThreatKeys != undefined) {
    //   this.setActivityInLogControls("Keys", iact.nonThreatKeys);
    // }
    // else if (iact.anomaly != undefined) {
    //   this.setActivityInLogControls("", iact.anomaly);
    // }
    // else if (iact.noObjects != undefined) {
    //   this.setActivityInLogControls("", iact.noObjects);
    // }
  }

  // Use this methods to send message back to server
  sendAction() {
    console.log("Sending message");
    this.messagingService.send("/server-receiver", {
      text: "Threat activity",
      text2: "Threat activity acknolodgement"
    });
  }

  filterDeployments(filter: string) {
    setTimeout(() => {
      // this.dataSource = new MatTableDataSource<IActivity>((this.iactivity.length >= 5 ? this.iactivity.slice(0, 5) : this.iactivity));
      this.dataSource = new MatTableDataSource<IActivity>(this.iactivity);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  ngOnInit() {
    clearInterval(this.myVar);
    this.userSettingService.getUserSetting("global_setting").subscribe(res => {
      let iUserSetting: IUserSetting = res["data"].filter(a => a.locationId == '1')[0];

      //this.isStopThreat = iUserSetting.stopThreatUpdate;  
      this.betaTestMode = iUserSetting.betaTestMode;
      this.primaryGuardMode = iUserSetting.primaryGuardMode;
      this.primaryDevice = iUserSetting.primaryDevice;
      this.getPrimaryTabletFlag();
      console.log("betaTestMode: " + this.betaTestMode);
      console.log("primaryGuardMode: " + this.primaryGuardMode);

      this.getAllThreatActivities();
      this.timerFlag = true;

      this.defaultSettings();
      setTimeout(() => {
        this.showObjects({}, false);

      }, 1000);
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
    /////////
    // $(".activityRightPanel").css("height",window.innerHeight);alert(window.innerHeight)

  }

  ngAfterViewInit() {
    // this.date = this.format(new Date().getTime(),'MM/dd/yyyy');
    // this.time = this.format(new Date().getTime(),'HH:mm');
  }

  getAllThreatActivities() {
    this.spinnerService.show();
    // let localIp: string = (this.primaryDevice == false ? "" : sessionStorage.getItem('LOCAL_IP'));
    let localIp: string = (this.primaryDevice == false ? "" : this.shareDataService.email);
    this.threatActivityService.getThreatActivities(localIp).subscribe(res => {
      var activitydata: OldActivityMonitoring = (this.primaryDevice == false ? res['data'] : res['data']['#result-set-1']);
      //console.log(JSON.stringify(this.acms))
      for (var i in activitydata) {
        let iact: IActivity = this.oldaddThreats("", "", activitydata[i], false);
        iact.actualResult = activitydata[i].actualResult;
        this.iactivity.push(iact);
      }

      this.filterDeployments('');
      this.defaultSettings();
      this.showObjects({}, false);

      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        console.log("Error occurred: " + err.message);
      });
  }

  selectActivity(id) {
    let iactivityMonitoring: IActivityMonitoring[] = this.acms.filter(a => a.id == id);

    this.showObjects(iactivityMonitoring[0], true);
    this.timerFlag = true;

    this.highlightActivity(id);
  }

  addThreats(contextFront, context, acm: IActivityMonitoring, showThreat: boolean) {
    let threatIconI = ActivityConstants.noImageIcon;

    let dateI = this.format(parseInt(acm.creationTimestamp), 'MM/dd/yyyy');
    let timeI = this.format(parseInt(acm.creationTimestamp), 'HH:mm:ss');

    this.statusI = "--";
    this.threatTypeI = "--";
    this.gate = "";
    this.lane = "";

    //fulldisplay
    if (acm.noThreatConfig != undefined) {
      if (acm.objectDetected != undefined && acm.objectDetected == false) {
        this.statusI = ActivityConstants.statusOk;
        this.threatTypeI = ActivityConstants.threatNoObject;
        this.threatIconI = ActivityConstants.smallNoThreatIcon;
        this.selectedThreatStatusImageI = ActivityConstants.largeNoThreatIcon;

        if (showThreat) {
          this.drawBorder(context, ActivityConstants.noThreat);
        }
      }
      else {
        //cellphone
        if (acm.anomalies.cellphone != undefined && acm.anomalies.cellphone.length > 0) {
          this.statusI = ActivityConstants.statusAnomalies;
          this.threatTypeI = ActivityConstants.threatAnomaly;
          this.threatIconI = ActivityConstants.smallAnomalyIcon;
          this.selectedThreatStatusImageI = ActivityConstants.largeAnomalyIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.anomalies.cellphone, ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatCellphone);
        }

        //keys
        if (acm.anomalies.keys != undefined && acm.anomalies.keys.length > 0) {
          this.statusI = ActivityConstants.statusAnomalies;
          this.threatTypeI = ActivityConstants.threatAnomaly;
          this.threatIconI = ActivityConstants.smallAnomalyIcon;
          this.selectedThreatStatusImageI = ActivityConstants.largeAnomalyIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.anomalies.keys, ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatKeys);
        }

        //anomalies
        // if (acm.anomaly != undefined) {
        //   if (acm.anomaly == true) {
        //     this.statusI = ActivityConstants.statusAnomalies;
        //     this.threatTypeI = ActivityConstants.threatAnomaly;
        //     this.threatIconI = ActivityConstants.smallAnomalyIcon;
        //     this.selectedThreatStatusImageI = ActivityConstants.largeAnomalyIcon;

        //     if (showThreat) {
        //       this.drawBorder(context, ActivityConstants.anomaly);
        //     }
        //   }
        // }

        //anomalies
        if (acm.anomalies.genericAnomaly != undefined && acm.anomalies.genericAnomaly.length > 0) {
          this.statusI = ActivityConstants.statusAnomalies;
          this.threatTypeI = ActivityConstants.threatAnomaly;
          this.threatIconI = ActivityConstants.smallAnomalyIcon;
          this.selectedThreatStatusImageI = ActivityConstants.largeAnomalyIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.anomalies.genericAnomaly, ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.anomaly);
        }

        //Handgun
        if (acm.threats.handgun != undefined && acm.threats.handgun.length > 0) {
          this.threatTypeI = ActivityConstants.threatHandgun;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.handgun, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatHandgun);
        }

        //Rifle
        if (acm.threats.rifle != undefined && acm.threats.rifle.length > 0) {
          this.threatTypeI = ActivityConstants.threatRifle;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.rifle, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatRifle);
        }

        //pipes
        if (acm.threats.pipeBomb != undefined && acm.threats.pipeBomb.length > 0) {
          this.threatTypeI = ActivityConstants.threatPipebomb;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.pipeBomb, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatPipebomb);
        }

        //knife
        if (acm.threats.knife != undefined && acm.threats.knife.length > 0) {
          this.threatTypeI = ActivityConstants.threatKnife;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.knife, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatKnife);
        }

        //Threat
        if (acm.threats.genericThreat != undefined && acm.threats.genericThreat.length > 0) {
          this.threatTypeI = ActivityConstants.threatThreat;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          this.showThreats(showThreat, contextFront, context, acm, acm.threats.genericThreat, ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatThreat);
        }
      }
    }

    if (!this.isThreatFlag) {
      this.date = dateI;
      this.time = timeI;

      this.threatIcon = this.threatIconI;

      this.status = this.statusI;
      this.threatType = this.threatTypeI;
      this.selectedThreatStatusImage = this.selectedThreatStatusImageI;
    }

    let iact: Activity = new Activity(acm.id, this.statusI, timeI, this.threatIconI, acm.creationTimestamp, this.threatTypeI);
    return iact;
  }

  showThreats(showThreat: boolean, contextFront, context, acm: IActivityMonitoring, threatLocationarray: string[],
    threat: string, statusThreat: string, smallThreatIcon: string, largeThreatIcon: string, threatType: string) {
    if (!this.isThreatFlag) {
      this.statusI = statusThreat;
      this.threatTypeI = threatType;
      this.threatIconI = smallThreatIcon;
      this.selectedThreatStatusImageI = largeThreatIcon;
    }

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

        this.threatLocate = threatLocation;
      }
    });
  }

  highlightActivity(id) {
    $(".threat-act").each(function () {
      $(this).parent().attr("style", "background: #f8f8f8; cursor: pointer");
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
      if (showThreat) {//alert(showThreat)
        this.addThreats(contextFront, context, acm, true);
      }
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
    // let source = new Image();
    // source.crossOrigin = 'Anonymous';
    // source.onload = () => {
    //   context.drawImage(source, 0, 0);
    // };

    // let borderImage: string = "";
    // if (threatType == ActivityConstants.threat) {
    //   borderImage = ActivityConstants.threatBorderImage;
    // }
    // else if (threatType == ActivityConstants.noThreat) {
    //   borderImage = ActivityConstants.noThreatBorderImage;
    // }
    // else {
    //   borderImage = ActivityConstants.anomalyBorderImage;
    // }
    // source.src = borderImage;

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

  continueActivity(type) {
    this.isThreatFlag = false;

    if (type == 1) {

      let status: IDeviceDetect = {
        left_mac_address: this.acm.devices[0],
        right_mac_address: this.acm.devices[1],
        status: 'THREAT_DISPLAY_END'
      }
      this.deviceDetectService.sendStatus(status).subscribe(res => {
        console.log(res);
      },
        err => {
          console.log("Error occurred: " + err.message);
        })

      $("#dv_recentActivityThreat").hide();
      $("#dv_recentActivity").show();     //alert("C: "+this.isThreatFlag) 

      this.defaultSettings();
      this.showObjects({}, false);

      $(".canvas_wrapper").attr("style", "border-color: #fcfcfc;");

      $(".threat-act").each(function () {
        $(this).parent().attr("style", "background: #f8f8f8; cursor: pointer");
      });

      $("#dv_log").hide();
      this.startCall();
    }
    else {
      if (!this.acm.anomalies.genericAnomaly && !this.acm.anomalies.cellphone && !this.acm.anomalies.keys && this.acm.objectDetected)
        this.isThreatFlag = true;
      $("#dv_confirm").hide();
      $("#dv_actual_logs").hide();
      $("#dv_rcact").css("background-color", "#f8f8f8");
      $("#dv_recentActivityThreatOverlay").hide();
      // $("#dv_recentActivityThreat").hide();
      // $("#dv_recentActivity").show();

      this.enableSave(false);
      $("#dv_log").hide();
      // this.startCall();
    }
  }

  noteThreatId: string = "";

  showLogSection() {
    this.enableSaveFlag = true;
    this.rowwisedata = [];
    this.logactualresultdata = [];
    this.noteThreatId = this.currentThreatId;
    $("#dv_rcact").css("background-color", "cyan");
    $("#dv_log").hide();
    $("#dv_confirm").show();
    $("#dv_actual_logs").show();
    $("#dv_recentActivityThreatOverlay").show();

    let logthreat = this.acms.filter(a => a.id == this.currentThreatId)[0];
    this.logactualthreat = [];

    if (logthreat.objectDetected != undefined && logthreat.objectDetected == false) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = [];
      threat.weapon = "";
      threat.threattype = "No Object";
      this.logactualthreat.push(threat);
    }

    if (logthreat.anomalies.cellphone != undefined && logthreat.anomalies.cellphone.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.anomalies.cellphone;
      threat.weapon = "Cellphone";
      threat.threattype = "Anomaly";
      this.logactualthreat.push(threat);
    }

    //keys
    if (logthreat.anomalies.keys != undefined && logthreat.anomalies.keys.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.anomalies.keys;
      threat.weapon = "Keys";
      threat.threattype = "Anomaly";
      this.logactualthreat.push(threat);
    }

    //anomalies
    if (logthreat.anomalies.genericAnomaly != undefined && logthreat.anomalies.genericAnomaly.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.anomalies.genericAnomaly;
      threat.weapon = "Anomaly";
      threat.threattype = "Anomaly";
      this.logactualthreat.push(threat);
    }

    //Handgun
    if (logthreat.threats.handgun != undefined && logthreat.threats.handgun.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.handgun;
      threat.weapon = "Handgun";
      threat.threattype = "Threat";
      this.logactualthreat.push(threat);
    }

    //Rifle
    if (logthreat.threats.rifle != undefined && logthreat.threats.rifle.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.rifle;
      threat.weapon = "Rifle";
      threat.threattype = "Threat";
      this.logactualthreat.push(threat);
    }

    //pipes
    if (logthreat.threats.pipeBomb != undefined && logthreat.threats.pipeBomb.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.pipeBomb;
      threat.weapon = "Pipebomb";
      threat.threattype = "Threat";
      this.logactualthreat.push(threat);
    }

    //knife
    if (logthreat.threats.knife != undefined && logthreat.threats.knife.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.knife;
      threat.weapon = "Knife";
      threat.threattype = "Threat";
      this.logactualthreat.push(threat);
    }

    //Threat
    if (logthreat.threats.genericThreat != undefined && logthreat.threats.genericThreat.length > 0) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.genericThreat;
      threat.weapon = "Generic Threat";
      threat.threattype = "Threat";
      this.logactualthreat.push(threat);
    }

    for (let i = 0; i < this.logactualthreat.length; i++) {
      let threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      this.logactualresultdata.push(threat);
    }

    // this.setActivityInLogControls("","");
    if (!this.acm.anomalies.genericAnomaly && !this.acm.anomalies.cellphone && !this.acm.anomalies.keys && this.acm.objectDetected)
      this.isThreatFlag = true;
    // this.stopCall();
  }

  note: string = "";

  addNote() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = this.note;
    let dialogRef = this.dialog.open(AddnoteComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.note = result;
      if (result != "") {
        $("#btnContinue").css("background", "cyan");
      }
      else {
        $("#btnContinue").css("background", "#ffffff");
      }
    });
  }

  setActivityInLogControls(weaponType, location) {
    //if (weaponType != "") {
    this.form.patchValue({
      r_result: 1,
      threatType: "",
      weaponType: weaponType,
      threatLocation: location //,      
      //note: "test"
    });
    //}
  }

  setDefaultActivityInLogControls(weaponType, location) {
    //if (weaponType != "") {
    this.form.patchValue({
      //r_result: 1,
      threatType: "",
      weaponType: weaponType,
      threatLocation: location //,      
      //note: "test"
    });
    //}
  }

  saveLog() {
    let logthreattype: string = '';
    let logweapon: string = '';
    let loglocation: string = '';
    let logisactual = this.logactualresultdata.filter(x => x.isactual == true).length > 0 ? false : true;

    this.logactualresultdata.forEach(function (value, index) {
      logthreattype += (index > 0 && logthreattype != "" && value.threattype != "" ? ", " + value.threattype : value.threattype);
      logweapon += (index > 0 && logweapon != "" && value.weapon != "" ? ", " + value.weapon : value.weapon);
      loglocation += (index > 0 && loglocation != "" && value.location.toString() != "" ? ", " + value.location.toString() : value.location.toString());
    })

    if (this.enableSaveFlag) {
      let gatelogObject = {
        actualResult: logisactual,
        deviceMacAddress: "12345678",
        gateName: "Gate A",
        laneName: "Lane A",
        note: this.note,
        threatLocation: loglocation,
        threatType: logthreattype,
        userName: "test",
        typeOfWeapon: logweapon,
        threatConfigId: this.noteThreatId
      };

      console.log(JSON.stringify(gatelogObject))

      this.threatLogService.saveThreatLog(gatelogObject).subscribe(res => {
        this.spinnerService.show();
        //if (res['status'] == 200) {
        this.iactivity[this.iactivity.length - 1].actualResult = logisactual;
        //console.log(JSON.stringify(this.iactivity));
        this.filterDeployments("");
        this.spinnerService.hide();

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification("Logs saved successfully", 'top', 'center', '', 'info-circle');
        });

        //$("#dv_log").show();
        $("#dv_confirm").hide();
        $("#dv_actual_logs").hide();
        $("#dv_rcact").css("background-color", "#f8f8f8");
        $("#dv_recentActivityThreatOverlay").hide();
        $("#dv_log").hide();
        // $("#dv_recentActivity").show();
        // $("#dv_recentActivityThreat").hide();
        // this.isThreatFlag = false;
        // this.startCall();
        //
        this.defaultSettings();
        this.showObjects({}, false);

        $(".canvas_wrapper").attr("style", "border-color: #fcfcfc;");

        $(".threat-act").each(function () {
          $(this).parent().attr("style", "background: #f8f8f8; cursor: pointer");
        });

        this.note = "";
        $("#btnContinue").css("background", "#ffffff");
        //
        this.acms = [];
        this.iactivity = [];

        this.getAllThreatActivities();

        // this.acms = [];
        // this.iactivity = [];

        // this.getAllThreatActivities();
        // }
        // else if (res['status'] == 500) {
        //   this.spinnerService.hide();
        //   this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        // }
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

      this.enableSave(false);
    }
  }

  onselectthreattype(value, row, type) {
    if (type == "threattype")
      this.logactualresultdata[row].threattype = value.toString();
    if (type == "weapon")
      this.logactualresultdata[row].weapon = value.toString();
    if (type == "location")
      this.logactualresultdata[row].location = value.toString();
    if (type == "actualresult")
      this.logactualresultdata[row].isactual = value;
  }

  enableSaveFlag: boolean = false;
  enableSave(enable: boolean) {
    this.enableSaveFlag = enable;
    this.note = "";
    $("#btnContinue").css("background", "#ffffff");

    if (enable) {
      $("#btnConfirm").css("background-color", "#143345");
      $("#btnConfirm").css("color", "#ffffff");
      $("#weaponType").css("background-color", "#b7b7b7");
      $("#threatLocation").css("background-color", "#b7b7b7");
      $("#threatType").css("background-color", "#b7b7b7");
    }
    else {
      $("#btnConfirm").css("background-color", "#8292A0");
      $("#btnConfirm").css("color", "#707070");
      $("#weaponType").css("background-color", "#ffffff");
      $("#threatLocation").css("background-color", "#ffffff");
      $("#threatType").css("background-color", "#ffffff");
    }
  }

  onResultSelectionChange(result): void {
    this.r_resultSelected = result;
    //console.log(result);
  }

  setConfirm() {
    if (this.form.controls["threatLocation"].value != "" && this.form.controls["weaponType"].value != "") {
      $("#btnConfirm").css("background-color", "#143345");
      $("#btnConfirm").css("color", "#ffffff");
      this.enableSaveFlag = true;
    }
    else {
      $("#btnConfirm").css("background-color", "#8292A0");
      $("#btnConfirm").css("color", "#707070");
      this.enableSaveFlag = false;
    }
  }

  startCall() {
    console.log("Start call");
    console.log(this.isThreatFlag);
    this.startService();
  }

  stopCall() {
    //if (this.isThreatFlag) {
    var myVar = setInterval(() => {
      if (this.isThreatFlag && this.router.url == "/admin/activitymonitoring") {
        //Stop Call
        console.log(this.isThreatFlag + " Stop call");
        this.stopService();
      }
      else {
        clearInterval(myVar);
      }
      console.log(this.isThreatFlag);
    }, environment.stopCallInterval);
    // }
  }

  startService() {
    this.threatLogService.startThreatMessage().subscribe(response => {
      console.log("Start call sent successfully");
    }, error => {
      console.log("Error occurred in Start call: " + error.message);
    });
  }

  stopService() {
    this.threatLogService.stopThreatMessage().subscribe(res => {
      console.log("Stop call sent successfully");
    }, error => {
      console.log("Error occurred in Stop call: " + error.message);
    });
  }

  getPrimaryTabletFlag() {
    this.tabletService.getTablets().subscribe(res => {
      let prTab = res["data"].filter(a => a.tabletMacAddress == this.shareDataService.email);
      if (prTab != undefined && JSON.stringify(prTab) != '[]') {
        this.primaryTablet = prTab[0]['primaryTablet'];
      }

      console.log("primaryTablet: " + this.primaryTablet);
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  showlogdetail(threatid) {
    this.spinnerService.show();
    let threatdetail = this.acms.filter(a => a.id == threatid)[0];

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = threatdetail;
    let dialogRef = this.dialog.open(LogdetailsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/admin/activitymonitoring');
    });
  }

  sendDisplayStart(iact: IActivityMonitoring) {
    this.myVar = setInterval(() => {
      if (this.isThreatFlag && this.router.url == "/admin/activitymonitoring") {
        //Stop Call
        console.log(this.isThreatFlag + " THREAT_DISPLAY_START");
        let status: IDeviceDetect = {
          left_mac_address: iact.devices[0],
          right_mac_address: iact.devices[1],
          status: 'THREAT_DISPLAY_START'
        }
        this.deviceDetectService.sendStatus(status).subscribe(res => {
          console.log(res);
        },
          err => {
            console.log("Error occurred: " + err.message);
          });
      }
      else {
        clearInterval(this.myVar);
      }
      console.log(this.isThreatFlag);
    }, environment.stopCallInterval);
  }

  oldaddThreats(contextFront, context, acm: OldActivityMonitoring, showThreat: boolean) {
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

    let threatIconI = ActivityConstants.noImageIcon;

    let dateI = this.format(parseInt(acm.creationTimestamp), 'MM/dd/yyyy');
    let timeI = this.format(parseInt(acm.creationTimestamp), 'HH:mm:ss');

    this.statusI = "--";
    this.threatTypeI = "--";
    this.gate = "";
    this.lane = "";

    //fulldisplay
    if (acm.noThreatConfig != undefined) {
      if (acm.noObjects != undefined && acm.noObjects == false) {
        this.statusI = ActivityConstants.statusOk;
        this.threatTypeI = ActivityConstants.threatNoObject;
        this.threatIconI = ActivityConstants.smallNoThreatIcon;
        this.selectedThreatStatusImageI = ActivityConstants.largeNoThreatIcon;
        recentactivitythreat.objectDetected = false;

        if (showThreat) {
          this.drawBorder(context, ActivityConstants.noThreat);
        }
      }
      else {
        //cellphone
        if (acm.nonThreatCellphone != undefined && acm.nonThreatCellphone != "" && acm.nonThreatCellphone != "null") {
          this.threatTypeI = ActivityConstants.threatCellphone;
          this.threatIconI = ActivityConstants.smallAnomalyIcon;
          recentactivitythreat.anomalies.cellphone = acm.nonThreatCellphone.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.nonThreatCellphone.split(","), ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatCellphone);
        }

        //keys
        if (acm.nonThreatKeys != undefined && acm.nonThreatKeys != "" && acm.nonThreatKeys != "null") {
          this.threatTypeI = ActivityConstants.threatKeys;
          this.threatIconI = ActivityConstants.smallAnomalyIcon;
          recentactivitythreat.anomalies.keys = acm.nonThreatKeys.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.nonThreatKeys.split(","), ActivityConstants.anomaly,
            ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon, ActivityConstants.threatKeys);
        }

        //anomalies
        if (acm.anomaly != undefined && acm.anomaly != "" && acm.anomaly != "null") {
          this.statusI = ActivityConstants.statusAnomalies;
          this.threatTypeI = ActivityConstants.threatAnomaly;
          this.threatIconI = ActivityConstants.smallAnomalyIcon;
          this.selectedThreatStatusImageI = ActivityConstants.largeAnomalyIcon;
          recentactivitythreat.anomalies.genericAnomaly = acm.anomaly.split(",");

          if (showThreat) {
            this.drawBorder(context, ActivityConstants.anomaly);
          }
        }

        //Handgun
        if (acm.threatHandgun != undefined && acm.threatHandgun != "" && acm.threatHandgun != "null") {
          this.threatTypeI = ActivityConstants.threatHandgun;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          recentactivitythreat.threats.handgun = acm.threatHandgun.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatHandgun.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatHandgun);
        }

        //Rifle
        if (acm.threatRifle != undefined && acm.threatRifle != "" && acm.threatRifle != "null") {
          this.threatTypeI = ActivityConstants.threatRifle;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          recentactivitythreat.threats.rifle = acm.threatRifle.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatRifle.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatRifle);
        }

        //pipes
        if (acm.threatPipeBomb != undefined && acm.threatPipeBomb != "" && acm.threatPipeBomb != "null") {
          this.threatTypeI = ActivityConstants.threatPipebomb;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          recentactivitythreat.threats.pipeBomb = acm.threatPipeBomb.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatPipeBomb.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatPipebomb);
        }

        //knife
        if (acm.threatKnife != undefined && acm.threatKnife != "" && acm.threatKnife != "null") {
          this.threatTypeI = ActivityConstants.threatKnife;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          recentactivitythreat.threats.knife = acm.threatKnife.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatKnife.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatKnife);
        }

        //Threat
        if (acm.threatThreat != undefined && acm.threatThreat != "" && acm.threatThreat != "null") {
          this.threatTypeI = ActivityConstants.threatThreat;
          this.threatIconI = ActivityConstants.smallThreatIcon;
          recentactivitythreat.threats.genericThreat = acm.threatThreat.split(",");
          this.showThreats(showThreat, contextFront, context, acm, acm.threatThreat.split(","), ActivityConstants.threat,
            ActivityConstants.statusThreat, ActivityConstants.smallThreatIcon, ActivityConstants.largeThreatIcon, ActivityConstants.threatThreat);
        }
      }
    }

    if (!this.isThreatFlag) {
      this.date = dateI;
      this.time = timeI;

      this.threatIcon = this.threatIconI;

      this.status = this.statusI;
      this.threatType = this.threatTypeI;
      this.selectedThreatStatusImage = this.selectedThreatStatusImageI;
    }

    let iact: Activity = new Activity(acm.id, this.statusI, timeI, this.threatIconI, acm.creationTimestamp, this.threatTypeI);
    this.acms.push(recentactivitythreat);
    return iact;
  }
}
