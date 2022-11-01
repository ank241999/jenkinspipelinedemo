import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ITablet } from '../../../../assets/interfaces/itablet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { TextValidator } from '../../../../assets/common/text.validator';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IDevice } from '../../../../assets/interfaces/idevice';
import { DevicemanagementService } from '../../../../assets/services/devicemanagement.service';

@Component({
  selector: 'app-editdevice',
  templateUrl: './editdevice.component.html',
  styleUrls: ['./editdevice.component.scss']
})
export class EditdeviceComponent implements OnInit {

  device: IDevice = {};
  alldevices: IDevice[] = [];
  form: FormGroup;
  isValidExpiryDate: number = 0;

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
    private shareDataService: ShareDataService,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService,
    private notificationService: NotificationService,
    private translate: TranslateService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.form = formBuilder.group({
      Name: new FormControl('', [Validators.required, TextValidator.cannotContainSpace]),
      macAddress: new FormControl('', Validators.required),
      soundAddress: new FormControl('', Validators.required),
      lightingAddress: new FormControl('', Validators.required),
      leftProximitysensorAddress: new FormControl('', Validators.required),
      rightProximitysensorAddress: new FormControl('', Validators.required),
      physicalMark: new FormControl('', Validators.required),
      ipAddress: new FormControl('', Validators.required),
      side: new FormControl(""),
      status: new FormControl('')
    });

    this.device = shareDataService.getSharedData();
    this.alldevices = JSON.parse(localStorage.getItem("alldevices"));
    localStorage.removeItem("alldevices");

    console.log(this.device);

    this.form.patchValue({
      Name: this.device.name,
      macAddress: this.device.macAddress,
      soundAddress: this.device.soundAddress,
      lightingAddress: this.device.lightingAddress,
      leftProximitysensorAddress: this.device.leftProximitySensorAddress,
      rightProximitysensorAddress: this.device.rightProximitySensorAddress,
      physicalMark: this.device.physicalMark,
      ipAddress: this.device.ipAddress,
      side: this.device.side,
      status: this.device.status,
    })
  }

  ngOnInit() {
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

  onSubmit() {
    let existdevice = this.alldevices.filter(a => a.macAddress == this.form.controls['macAddress'].value)[0];
    if (existdevice && existdevice.id != this.device.id) {
      this.notificationService.showNotification('Device UID is already in use', 'top', 'center', 'warning', 'info-circle');
    }
    else {
      let deviceObject: IDevice = {
        id: this.device.id,
        name: this.form.controls['Name'].value,
        macAddress: this.form.controls['macAddress'].value,
        side: this.form.controls['side'].value,
        status: this.form.controls['status'].value,
        lightingAddress: this.form.controls['lightingAddress'].value,
        soundAddress: this.form.controls['soundAddress'].value,
        physicalMark: this.form.controls['physicalMark'].value,
        leftProximitySensorAddress: this.form.controls['leftProximitysensorAddress'].value,
        rightProximitySensorAddress: this.form.controls['rightProximitysensorAddress'].value,
        ipAddress: this.form.controls['ipAddress'].value
      }

      this.deviceService.updateDevice(deviceObject).subscribe(res => {
        if (res['status'] == 201) {
          this.spinnerService.hide();
          let response: IDevice = res["data"];

          this.notificationService.showNotification("Device Updated successfully", 'top', 'center', '', 'info-circle');
        }

        else if (res['status'] == 500) {
          this.spinnerService.hide();
          this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        }

        setTimeout(() => {
          this.onScreenBack();
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
  }


  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

}

