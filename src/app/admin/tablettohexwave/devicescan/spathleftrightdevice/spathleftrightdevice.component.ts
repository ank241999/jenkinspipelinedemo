import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../../../assets/services/share-data.service';
import { LaneDeviceService } from '../../../../../assets/services/lanedevice.service'
import { NotificationService } from '../../../../../assets/services/notification.service';
import { v4 as uuid } from 'uuid';
import { IEntrance } from '../../../../../assets/interfaces/ientrance';
import { IDevice } from '../../../../../assets/interfaces/idevice';
var randomMac = require('random-mac');

@Component({
  selector: 'app-spathleftrightdevice',
  templateUrl: './spathleftrightdevice.component.html',
  styleUrls: ['./spathleftrightdevice.component.scss']
})
export class SpathleftrightdeviceComponent implements OnInit {
  entrance: IEntrance = { "id": 0, "name": "Test" };
  laneName: string = "";

  locationId: number = 1;
  devices: IDevice[] = [];

  constructor(private location: Location,
    private router: Router, private shareDataService: ShareDataService,
    private laneDeviceService: LaneDeviceService,
    private notificationService: NotificationService) {

    this.devices.push(JSON.parse(localStorage.getItem('leftDevice')));
    this.devices.push(JSON.parse(localStorage.getItem('rightDevice')));
    localStorage.removeItem("leftDevice");
    localStorage.removeItem("rightDevice");
    console.log(this.devices);

    this.laneName = shareDataService.getSharedData();
    this.entrance = shareDataService.getGlobalObject();
  }

  ngOnInit() {
  }

  setupLanes() {
    this.onAddClick(1);
  }

  onAnotherGate() {
    this.onAddClick(2);
  }

  onNoLanes() {
    this.onAddClick(3);
  }

  addDevices(tryAgain: number, laneId: number) {
    let deviceAddCount: number = 0;

    this.devices.forEach(element => {
      element.laneId = laneId;
      element.spathFlag = true;

      this.laneDeviceService.putDevice(element).subscribe(res => {
        if (res['status'].toString() == '200') {
          ++deviceAddCount;

          if (deviceAddCount == 2) {
            this.notificationService.showNotification("Device added successfully", 'top', 'center', '', 'info-circle');

            setTimeout(() => {
              if (tryAgain == 1) {
                this.shareDataService.openPopup = true;
                this.router.navigate(['/admin/tablettohexwave/hexwavepairdetails']);
              }
              else if (tryAgain == 2) {
                this.shareDataService.openPopup = false;
                this.router.navigate(['/admin/tablettohexwave']);
              }
              else {
                this.router.navigate(['/admin/dashboard']);
              }
            }, 3000);
          }
        }
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

  onAddClick(tryAgain: number) {
    let tmpLaneName: string = this.shareDataService.getSharedData();

    if (tmpLaneName != null && tmpLaneName != undefined) {
      let laneObject = {
        entraneID: this.entrance.id,
        laneName: tmpLaneName
      };
      this.laneDeviceService.createLane(laneObject).subscribe(res => {
        if (res["status"].toString() == "201") {
          this.addDevices(tryAgain, res["data"].id);
        }
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
    }
  }
}
