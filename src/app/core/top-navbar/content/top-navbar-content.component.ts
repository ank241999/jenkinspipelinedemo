import { Component, Input, ViewEncapsulation, Inject } from '@angular/core';
import { SideMenuService } from '../../side-menu/side-menu.service';
import { ResponsiveBreakpointsService } from '../../responsive-breakpoints/responsive-breakpoints.service';
// import { APP_BASE_HREF } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CommunicationService } from '../../../../assets/services/communication-service';
import { MessagingService } from '../../../../assets/services/messaging.service';
import { IActivityMonitoring } from '../../../../assets/interfaces/iactivity-monitoring';
import { NotificationsMenuService } from '../../../core';
import { Message } from "@stomp/stompjs";
import { StompState } from "@stomp/ng2-stompjs";
import { ThreatNotificationService } from '../../../shared/threatnotification/threatnotification.service';

var $ = require('jquery');

@Component({
  selector: 'app-top-navbar-content',
  styleUrls: ['./styles/top-navbar-content.scss'],
  templateUrl: './top-navbar-content.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarContentComponent {
  @Input() messages = [];
  @Input() notifications = [];

  isAdmin: boolean = false
  sideMenuVisible = true;
  baseUrl = '';
  logggedInUser: string = "";
  logoImagePath: string = "/assets/images/Liberty-Defense-Logo-.png";

  messageHistory = [];
  acmList: IActivityMonitoring[] = [];
  acm: IActivityMonitoring = {};
  state: string = "NOT CONNECTED";
  timerFlag: boolean = false;
  notifCount = 0;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private sideMenuService: SideMenuService,
    private responsiveService: ResponsiveBreakpointsService,
    private router: Router, private userService: UserService,
    private translate: TranslateService,
    private shareDataService: ShareDataService,
    private communicationService: CommunicationService,
    private messagingService: MessagingService,
    private notificationsMenuService: NotificationsMenuService,
    private threatNotificationService: ThreatNotificationService
    //@Inject(APP_BASE_HREF) private baseHref: string
  ) {
    //this.baseUrl = baseHref;  
    this.shareDataService.setApplicationVariables();
    this.getLoggedInUser();
    this.isAdmin = (this.shareDataService.role == "advance" ? true : false);
    responsiveService.responsiveSubject
      .pipe(
        filter(breakpoint => breakpoint.screen === 'xs-or-sm')
      )
      .subscribe(breakpoint => {
        if (breakpoint.active) {
          this.sideMenuService.sidenav.mode = 'push';
          this.sideMenuService.sidenav.close().then(
            val => {
              // console.log('ok closing');
              this.sideMenuVisible = false;
            },
            err => {
              // console.log('error closing');
            },
            () => {
              // console.log('all closing');
            }
          );
        } else {
          this.sideMenuService.sidenav.mode = 'side';
        }
      });
  }

  ngOnInit() {
    if (this.shareDataService.logoImagePath) {
      this.logoImagePath = this.shareDataService.logoImagePath;
    }
    // else {
    //   setTimeout(() => {
    //     this.logoImagePath = this.shareDataService.logoImagePath;
    //   }, 3000);
    // }

    localStorage.setItem("isNotify", "false");
    //if (this.isAdmin)
    this.setNotifications();
  }

  toggleSideMenu(): void {
    this.sideMenuService.sidenav.toggle().then(
      val => {
        this.sideMenuVisible = !this.sideMenuVisible;
      },
      err => {
        // console.log('error toggle');
      },
      () => {
        // console.log('all toggle');
      }
    );
  }

  getLoggedInUser() {
    this.userService.getUsers(this.shareDataService.email).subscribe(res => {
      if (res['status'] == 200) {
        let user: IUser[] = res["data"];
        if (user.length > 0) {
          this.logggedInUser = user[0].firstName + " " + user[0].lastName;
        }
      }
      else if (res['status'] == 500) {
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  logout() {
    this.messagingService.disconnect();
    this.communicationService = null;
    localStorage.setItem("notificationCount", "0");

    this.userService.logOutUser().subscribe(res => {
      if (res['status'] == 200) {
        // ActivityConstants.retainRequiredValues();
        this.userService.logoutLog();
        this.shareDataService.clearSessionVariables();

        this.router.navigate(['/login']);
      }
      else if (res['status'] == 500) {
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  setNotifications() {
    try {
      // Subscribe to its stream (to listen on messages)
      this.messagingService.connect();
      this.messagingService.stream().subscribe((message: Message) => {
        if (message.body) {
           if (message.body.includes("logout") && this.shareDataService.email == JSON.parse(message.body)['email']) {
            this.messagingService.disconnect();
            this.communicationService = null;
            localStorage.setItem("notificationCount", "0");
            this.shareDataService.clearSessionVariables();
            this.router.navigate(['/login']);
          }
          else {
            this.messageHistory.unshift(message.body);
            this.acm = JSON.parse(message.body);

            this.notifCount = this.notifCount + 1;
            localStorage.setItem("notificationCount", this.notifCount.toString());

            this.notificationsMenuService.setNotifications(this.acm);
            this.communicationService.raiseEvent(this.acm);

            if (this.acm.gateName != undefined && this.acm.gateName != null) {
              if ((this.shareDataService.role == "advance" ? true : false) && this.shareDataService.role != null) {
                if (localStorage.getItem("isNotify") == "false") {
                  localStorage.setItem("isNotify", "true");
                  this.threatNotificationService.success(message.body, this.options);
                }
              }
            }

            setTimeout(() => {
              localStorage.setItem("isNotify", "false");
            }, environment.threatNotificationPopupInterval);
          }
        }
      });

      // Subscribe to its state (to know its connected or not)
      this.messagingService.state().subscribe((state: StompState) => {
        this.state = StompState[state];
      });
    }
    catch (e) {
    }
  }

  // Use this methods to send message back to server
  sendAction() {
    console.log("Sending message");
    this.messagingService.send("/server-receiver", {
      text: "Threat activity",
      text2: "Threat activity acknolodgement"
    });
  }


  // disableBeta() {
  //   try {
  //     if(localStorage.getItem("disableBeta")=="false"){
  //       $("#dv_log").hide();
  //       $("#dv_confirm").hide();
  //       $("#dv_actual_logs").hide();
  //       $("#dv_rcact").css("background-color", "#ffffff");

  //       $("#btnDisableBeta").text("ENABLE BETA TEST MODE");
  //       localStorage.setItem("disableBeta", "true");
  //     }
  //     else{
  //       $("#dv_log").show();
  //       $("#dv_confirm").hide();
  //       $("#dv_actual_logs").hide();
  //       $("#dv_rcact").css("background-color", "cyan");

  //       $("#btnDisableBeta").text("DISABLE BETA TEST MODE");
  //       localStorage.setItem("disableBeta", "false");
  //     }      
  //   }
  //   catch (ex) {

  //   }
  // }  
}
