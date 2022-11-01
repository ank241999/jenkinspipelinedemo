import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IEntrance } from '../../../../assets/interfaces/ientrance'
import { LaneDeviceService } from '../../../../assets/services/lanedevice.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IDevice } from '../../../../assets/interfaces/idevice';
import { ILane } from '../../../../assets/interfaces/ilane';
var randomMac = require('random-mac');

@Component({
  selector: 'app-devicescan',
  templateUrl: './devicescan.component.html',
  styleUrls: ['./devicescan.component.scss']
})
export class DevicescanComponent implements OnInit {
  entrance: IEntrance = { "id": 0, "name": "Test" };
  laneName: string = "";
  show: boolean;
  visible: boolean;
  laneId: number;



  devices = [{ "name": "Device 1", "macAddress": null, "side": "left", "tabletId": "1", "status": true, "laneId": 0 },
  { "name": "Device 2", "macAddress": null, "side": "right", "tabletId": "1", "status": true, "laneId": 0 }];


  constructor(private location: Location,
    private router: Router,
    public dialog: MatDialog,
    private shareDataService: ShareDataService,
    private laneDeviceService: LaneDeviceService,
    private notificationService: NotificationService) {
    this.laneId = shareDataService.getSharedData();
    this.show = false;
    this.visible = false;
    this.entrance = shareDataService.getGlobalObject();
    this.laneName = shareDataService.getSharedData();
  }

  ngOnInit() {
  }

  onBack() {
    this.location.back();
  }

  showButton1() {
    // this.show = true;
    this.router.navigateByUrl('/admin/tablettohexwave/ldevicescan');
  }

  showButton2() {
    // this.visible = true;
    this.router.navigateByUrl('/admin/tablettohexwave/spathleftdevice');

  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

  onAddClick() {
    this.devices.forEach(element => {
      // let entrance: IEntrance = this.shareDataService.globalObject;
      element.laneId = this.laneId;
      element.macAddress = randomMac();

      this.laneDeviceService.createDevice(element).subscribe(res => {
        // if (res['status1'] == 201) {
        this.notificationService.showNotification("Device added successfully", 'top', 'center', '', 'info-circle');

        setTimeout(() => {
          this.router.navigateByUrl('/admin/tablettohexwave/hexwavepairdetails');
        }, 3000);
        //}
      },
        err => {
          console.log("Error occurred: " + err.message);

          if (err["status"] == 500) {
            this.notificationService.showNotification("Internal server error", 'top', 'center', 'warning', 'info-circle');
          }
          else {
            this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
          }
        });
    });
  }
}
