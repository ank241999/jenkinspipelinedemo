import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { NotificationService } from '../../../assets/services/notification.service';
import { environment } from '../../../environments/environment';
import { RebootComponent } from './reboot/reboot.component';

@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit {
  url: string = environment.websocket_url.replace("9001/hello", "8234");
  urlMap: SafeResourceUrl;
  showcapture: boolean = false;

  constructor(private router: Router, private translate: TranslateService, public sanitizer: DomSanitizer, private notificationService: NotificationService, public dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService, private http: HttpClient) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/images/Liberty-Defense-Logo-.png");
  }

  startcapture() {
    this.spinnerService.show();
    this.http.get<any>("/start-capture").subscribe(res => {
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(this.url.replace("ws", "http"));
      this.showcapture = true;
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification("Error occurred: " + err['error']['reason'], 'top', 'center', 'danger', 'info-circle')
      })
  }

  stopcapture() {
    this.spinnerService.show();
    this.http.get<any>("/stop-capture").subscribe(res => {
      this.showcapture = false;
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification("Error occurred: " + err['error']['reason'], 'top', 'center', 'danger', 'info-circle')
      })
  }

  rebootDevice() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(RebootComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  onClose() {
    this.router.navigate(['/admin/dashboard'])
  }
}
