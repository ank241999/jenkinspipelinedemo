import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LaneDeviceService } from '../../../../../../assets/services/lanedevice.service';
import { NotificationService } from '../../../../../../assets/services/notification.service';
import { IDevice } from '../../../../../../assets/interfaces/idevice';
import { IDevicePair } from '../../../../../../assets/interfaces/idevicepair';

@Component({
  selector: 'app-portalconfigright',
  templateUrl: './portalconfigright.component.html',
  styleUrls: ['./portalconfigright.component.scss']
})
export class PortalconfigrightComponent implements OnInit {
  device: IDevice;
  lane: IDevicePair = {};

  constructor(private location: Location,
    private router: Router, private route: ActivatedRoute, private laneDeviceService: LaneDeviceService, private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  tryagain() {
    this.location.back();
  }
  onConfirm() {
    this.device = JSON.parse(localStorage.getItem('rightDevice'));
    let laneId = this.route.snapshot.queryParamMap.get('laneId');
    let isSPath = this.route.snapshot.queryParamMap.get('isSPath');

    if (laneId) {
      this.lane = JSON.parse(localStorage.getItem('editLane'));

      let rightDevice: IDevice = { laneId: +laneId, id: this.device.id, spathFlag: false };

      if (isSPath) {
        rightDevice.spathFlag = true;
      }

      this.laneDeviceService.putDevice(rightDevice).subscribe(res => {
        if (res['status'].toString() == '200') {
          this.notificationService.showNotification("Device paired successfully", 'top', 'center', '', 'info-circle');
          this.lane.rightDeviceName = this.device.name;
          this.lane.rightDeviceId = this.device.id;
          this.lane.rightDeviceMacAddress = this.device.macAddress;
          localStorage.setItem('editLane', JSON.stringify(this.lane));
          this.router.navigateByUrl('/admin/tablettohexwave/editlane');
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
        }
      );
    }
    else {
      this.router.navigateByUrl('/admin/tablettohexwave/leftrightdevices');
    }
  }
}
