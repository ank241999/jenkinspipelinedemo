import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { SideMenuService } from '../../side-menu/side-menu.service';
import { ResponsiveBreakpointsService } from '../../responsive-breakpoints/responsive-breakpoints.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';

import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IDeviceDetect } from '../../../../assets/interfaces/idevicedetect';
import { DeviceDetectSimulatorService } from '../../../../assets/services/device-detect-simulator.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { stat } from 'fs';
import { ThreatLogService } from '../../../../assets/services/threatlog.service';
var $ = require('jquery');

@Component({
  selector: 'app-side-menu-content',
  styleUrls: [
    './styles/side-menu-content.scss'
  ],
  templateUrl: './side-menu-content.component.html',
  encapsulation: ViewEncapsulation.None
})

export class SideMenuContentComponent {
  isAdmin: boolean = false;
  sideMenuVisible = true;
  logggedInUser: string = "";
  istechnicianltd: boolean = false;
  istechniciancust: boolean = false;

  constructor(
    private userService: UserService,
    private sideMenuService: SideMenuService,
    private responsiveService: ResponsiveBreakpointsService,
    private router: Router,
    private translate: TranslateService,
    public deviceDetectService: DeviceDetectSimulatorService,
    private notificationService: NotificationService,
    private threatLogService: ThreatLogService,
    private shareDataService: ShareDataService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.getLoggedInUser();
    this.isAdmin = (this.shareDataService.role == "advance" ? true : false);
    this.istechnicianltd = (this.shareDataService.role == "technicianltd" ? true : false);
    this.istechniciancust = (this.shareDataService.role == "techniciancust" ? true : false);

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
          this.sideMenuService.sidenav.mode = 'over';
        }
      });
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
    this.closeSettingsPanel();
  }

  toggleSideMenu_setting(): void {
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

  openSettingsPanel() {
    $(".btn_setting").hide();
    $(".setting_panel").animate({ width: '430px', opacity: '1' }, "fast");
    $(".tab").animate({ opacity: '1' }, "slow");
    document.getElementById("advanced").style.display = "block";
    //this.toggleSideMenu();
    this.toggleSideMenu_setting();
  }

  closeSettingsPanel() {
    $(".btn_setting").show();
    $(".tab").animate({ opacity: '0' }, "fast");
    // document.getElementById("tab_heading_accesspoint").style.display = "none";
    // document.getElementById("tab_heading_cta").style.display = "none";
    // document.getElementById("accesspoint").style.display = "none";
    // document.getElementById("cta").style.display = "none";
    $(".setting_panel").animate({ width: '0px', opacity: '0' }, "fast");
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

  forceclear() {
    let status: IDeviceDetect = {
      left_mac_address: '',
      right_mac_address: '',
      status: 'THREAT_DISPLAY_END'
    }
    this.deviceDetectService.sendStatus(status).subscribe(res => {
      if (res['status'] == 200) {
        this.notificationService.showNotification("Threat Display End Successfully", 'top', 'center', '', 'info-circle');
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      })

    this.threatLogService.startThreatMessage().subscribe(response => {
      console.log("Start call sent successfully");
    }, error => {
      console.log("Error occurred in Start call: " + error.message);
    });
  }

  logout() {
    this.userService.logOutUser().subscribe(res => {
      if (res['status'] == 200) {
        // ActivityConstants.retainRequiredValues();
        this.userService.logoutLog();
        this.shareDataService.clearSessionVariables();
        //localStorage.clear();

        localStorage.removeItem("userLogId");
        this.router.navigate(['/']);
      }
      else if (res['status'] == 400) {
        this.userService.logoutLog();
        this.shareDataService.clearSessionVariables();

        localStorage.removeItem("userLogId");
        this.router.navigate(['/']);
      }
      else if (res['status'] == 500) {
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }
}
