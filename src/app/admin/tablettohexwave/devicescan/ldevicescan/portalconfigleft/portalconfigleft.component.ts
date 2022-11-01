import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IDevice } from '../../../../../../assets/interfaces/idevice';
import { LaneDeviceService } from '../../../../../../assets/services/lanedevice.service';
import { NotificationService } from '../../../../../../assets/services/notification.service';
import { IDevicePair } from '../../../../../../assets/interfaces/idevicepair';

@Component({
  selector: 'app-portalconfigleft',
  templateUrl: './portalconfigleft.component.html',
  styleUrls: ['./portalconfigleft.component.scss']
})
export class PortalconfigleftComponent implements OnInit {
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
    let laneId = this.route.snapshot.queryParamMap.get('laneId');
    let isSPath = this.route.snapshot.queryParamMap.get('isSPath');

    if (laneId) {
      this.device = JSON.parse(localStorage.getItem('leftDevice'));
      this.lane = JSON.parse(localStorage.getItem('editLane'));

      let leftDevice: IDevice = { laneId: +laneId, id: this.device.id, spathFlag: false };

      if (isSPath) {
        leftDevice.spathFlag = true;
      }

      this.laneDeviceService.putDevice(leftDevice).subscribe(res => {
        if (res['status'].toString() == '200') {
          this.notificationService.showNotification("Device paired successfully", 'top', 'center', '', 'info-circle');
          this.lane.leftDeviceName = this.device.name;
          this.lane.leftDeviceId = this.device.id;
          this.lane.leftDeviceMacAddress = this.device.macAddress;
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
      this.router.navigateByUrl('/admin/tablettohexwave/rdevicescan');
    }
  }
}
