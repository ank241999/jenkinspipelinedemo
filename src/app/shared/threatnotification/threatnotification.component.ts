import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ThreatNotificationService } from './threatnotification.service';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { NotificationsMenuService } from '../../core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'threatnotification',
  templateUrl: 'threatnotification.component.html'
})
export class ThreatNotificationComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() message: IActivityMonitoring = {};
  @ViewChild('th_alert_dv', { static: true }) ThAlertDv: ElementRef;

  time: string = "";
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private threatNotificationService: ThreatNotificationService,
    private shareDataService: ShareDataService, private notificationsMenuService: NotificationsMenuService) { }

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.threatNotificationService.onAlert(this.id)
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          return;
        }
        
        this.message = JSON.parse(alert.message); console.log("Gate Name: " + this.message.gateName)
        this.time = this.msToTime(this.message.creationTimestamp);
        
        this.ThAlertDv.nativeElement.style.display = 'block';        

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(), environment.threatNotificationPopupInterval);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      this.removeAlert()
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert() {
    localStorage.setItem("isNotify", "false");
    this.ThAlertDv.nativeElement.style.display = 'none';
  }

  showThreat() {
    this.notificationsMenuService.removeNotification(this.message.id);
    this.shareDataService.setSharedData(this.message);
    //this.router.navigate(['./admin/activitymonitoring/activitythreats']);

    this.router.navigateByUrl('/?isskip=1', { skipLocationChange: true }).then(() => {
      this.router.navigate(['./admin/activitymonitoring/activitythreats']);
    });
  }

  showAllNotifications() {
    //this.router.navigate(['./admin/dashboard/notifications']);

    this.router.navigateByUrl('/?isskip=1', { skipLocationChange: true }).then(() => {
      this.router.navigate(['./admin/dashboard/notifications']);
    });
  }

  msToTime(s) {
    var utcSeconds = s / 1000;
    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(utcSeconds);

    let hours: number = date.getHours();
    let minutes: number = date.getMinutes();
    let ampm: string = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minuteStr: string = minutes < 10 ? '0' + minutes : minutes.toString();
    var strTime = hours + ':' + minuteStr + ' ' + ampm;
    return strTime;
  }
}