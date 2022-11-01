import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DevicemanagementService } from '../../../../../assets/services/devicemanagement.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../../assets/services/notification.service';
import { IDevice } from '../../../../../assets/interfaces/idevice';
import { DeviceDetectSimulatorService } from '../../../../../assets/services/device-detect-simulator.service';

@Component({
  selector: 'app-spathleftdevice',
  templateUrl: './spathleftdevice.component.html',
  styleUrls: ['./spathleftdevice.component.scss']
})
export class SpathleftdeviceComponent implements OnInit {

  showDevice: boolean = false;
  readyToSync: boolean = false;
  device: IDevice[] = [];
  selectedDevice: IDevice;
  isDeviceAvailable: string = "";

  constructor(private location: Location,
    public router: Router, public deviceService: DevicemanagementService, public deviceDetectService: DeviceDetectSimulatorService, private translate: TranslateService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.getDevice();
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

  onClick() {
    localStorage.setItem('leftDevice', JSON.stringify(this.selectedDevice));
    this.router.navigateByUrl('/admin/tablettohexwave/spathconfigleft');
  }

  getDevice() {
    this.deviceService.getDevices().subscribe(res => {
      if (res['status'] == 200) {
        let filteredDevices: IDevice[] = res["data"].filter(a => a.status == true && (a.laneId == null || a.laneId == 0) && a.side == "left");
        this.device = filteredDevices;
        if (this.device.length == 0) {
          this.isDeviceAvailable = "No Device Available.";
        }
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      })
  }

  changeDevice(val) {
    this.selectedDevice = this.device.filter(a => a.id == val)[0];
    console.log(this.selectedDevice);
    this.showDevice = true;
  }

  detectDevice() {
    this.deviceDetectService.detectDevice(this.selectedDevice.macAddress).subscribe(res => {
      if (res['status'] == 200) {
        this.notificationService.showNotification("Device Detected successfully", 'top', 'center', '', 'info-circle');
        this.readyToSync = true;
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
      })
  }
}
