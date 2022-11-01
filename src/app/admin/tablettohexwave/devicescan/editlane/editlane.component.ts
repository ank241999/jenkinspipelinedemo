import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TextValidator } from '../../../../../assets/common/text.validator';
import { ActivityConstants } from '../../../../../assets/constants/activity-constants';
import { IDevice } from '../../../../../assets/interfaces/idevice';
import { DevicemanagementService } from '../../../../../assets/services/devicemanagement.service';
import { NotificationService } from '../../../../../assets/services/notification.service';
import { ShareDataService } from '../../../../../assets/services/share-data.service';
import { IDevicePair } from '../../../../../assets/interfaces/idevicepair';
import { LaneDeviceService } from '../../../../../assets/services/lanedevice.service';
import { ILane } from '../../../../../assets/interfaces/ilane';
import { IEntrance } from '../../../../../assets/interfaces/ientrance';

@Component({
  selector: 'app-editlane',
  templateUrl: './editlane.component.html',
  styleUrls: ['./editlane.component.scss']
})
export class EditlaneComponent implements OnInit {

  device: IDevice = {};
  lane: IDevicePair = {};
  form: FormGroup;
  isValidExpiryDate: number = 0;
  isLeftDevicePair: boolean = true;
  isRightDevicePair: boolean = true;

  // Form validation messages
  validationMessages = {
    Name: [
      { type: 'required', message: 'Name is required.' }
    ],
  }

  Status = [{ "id": false, "status": "OFF" },
  { "id": true, "status": "ON" }];

  constructor(public formBuilder: FormBuilder,
    private deviceService: DevicemanagementService,
    private router: Router,
    private laneDeviceService: LaneDeviceService,
    private shareDataService: ShareDataService,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService,
    private notificationService: NotificationService,
    private translate: TranslateService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, TextValidator.cannotContainSpace]),
      leftDevice: new FormControl({ value: '', disabled: true }),
      rightDevice: new FormControl({ value: '', disabled: true })
    });

    this.lane = JSON.parse(localStorage.getItem('editLane'));
    // localStorage.removeItem("editLane");

    this.form.patchValue({
      Name: this.lane.laneName,
      leftDevice: this.lane.leftDeviceName,
      rightDevice: this.lane.rightDeviceName
    })

    if (this.lane.leftDeviceId == null) {
      this.isLeftDevicePair = false;
    }

    if (this.lane.rightDeviceId == null) {
      this.isRightDevicePair = false;
    }

    if (this.lane.isleftDeviceSPath == true) {
      this.lane.isrightDeviceSPath = true;
    }

    if (this.lane.isrightDeviceSPath == true) {
      this.lane.isleftDeviceSPath = true;
    }
  }

  validateFields(): void {
    if (!this.form.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.form.markAsTouched();
      for (const control in this.form.controls) {
        if (this.form.controls.hasOwnProperty(control)) {
          this.form.controls[control].markAsTouched();
          this.form.controls[control].markAsDirty();
        }
      }
    }
  }

  pairLeftDevice() {
    if (this.lane.isleftDeviceSPath == true) {
      this.router.navigate(['/admin/tablettohexwave/ldevicescan'], { queryParams: { laneId: this.lane.laneId, isSPath: true } })
    }
    else {
      this.router.navigate(['/admin/tablettohexwave/ldevicescan'], { queryParams: { laneId: this.lane.laneId } })
    }
  }

  pairRightDevice() {
    if (this.lane.isrightDeviceSPath == true) {
      this.router.navigate(['/admin/tablettohexwave/rdevicescan'], { queryParams: { laneId: this.lane.laneId, isSPath: true } })
    }
    else {
      this.router.navigate(['/admin/tablettohexwave/rdevicescan'], { queryParams: { laneId: this.lane.laneId } })
    }
  }

  unpairLeftDevice() {
    this.spinnerService.show();
    let leftDevice: IDevice = { laneId: 0, id: this.lane.leftDeviceId, spathFlag: this.lane.isleftDeviceSPath };
    this.laneDeviceService.putDevice(leftDevice).subscribe(res => {
      if (res['status'].toString() == '200') {
        this.notificationService.showNotification("Device unpaired successfully", 'top', 'center', '', 'info-circle');
        this.lane.leftDeviceName = null;
        this.lane.leftDeviceId = null;
        this.lane.leftDeviceMacAddress = null;
        localStorage.setItem('editLane', JSON.stringify(this.lane));
        this.spinnerService.hide();
        this.ngOnInit();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 500) {
          this.notificationService.showNotification("Internal server error", 'top', 'center', 'warning', 'info-circle');
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      }
    );
  }

  unpairRightDevice() {
    this.spinnerService.show();
    let leftDevice: IDevice = { laneId: 0, id: this.lane.rightDeviceId, spathFlag: this.lane.isrightDeviceSPath };
    this.laneDeviceService.putDevice(leftDevice).subscribe(res => {
      if (res['status'].toString() == '200') {
        this.notificationService.showNotification("Device unpaired successfully", 'top', 'center', '', 'info-circle');
        this.lane.rightDeviceId = null;
        this.lane.rightDeviceMacAddress = null;
        this.lane.rightDeviceName = null;
        localStorage.setItem('editLane', JSON.stringify(this.lane));
        this.spinnerService.hide();
        this.ngOnInit();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 500) {
          this.notificationService.showNotification("Internal server error", 'top', 'center', 'warning', 'info-circle');
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      }
    );
  }

  onSubmit() {
    this.spinnerService.show();
    localStorage.removeItem("editLane");
    let entrance: IEntrance = this.shareDataService.getGlobalObject();

    let laneObject = {
      id: this.lane.laneId,
      laneName: this.form.controls['Name'].value,
      entrance: entrance.id
    }

    this.laneDeviceService.putLane(laneObject).subscribe(res => {
      if (res['status'] == 201) {
        this.spinnerService.hide();

        this.notificationService.showNotification("Lane Updated successfully", 'top', 'center', '', 'info-circle');
      }

      else if (res['status'] == 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
      }

      setTimeout(() => {
        this.onScreenClose();
      }, 3000);
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
      })

  }

  onScreenClose() {
    this.router.navigate(['/admin/tablettohexwave/hexwavepairdetails'])
  }

}
