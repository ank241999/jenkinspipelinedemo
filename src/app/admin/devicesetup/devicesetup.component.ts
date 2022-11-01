import { Component, EventEmitter, Output, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { LaneDeviceService } from '../../../assets/services/lanedevice.service';
import { LocationService } from '../../../assets/services/location.service'
import { EntranceService } from '../../../assets/services/entrance.service'
import { ILocation } from '../../../assets/interfaces/ilocation';
import { IEntrance } from '../../../assets/interfaces/ientrance';
import { IDevice } from '../../../assets/interfaces/idevice';
import { NotificationService } from '../../../assets/services/notification.service';

@Component({
  selector: 'app-devicesetup-page',
  templateUrl: './devicesetup.component.html',
  styleUrls: ['./styles/_forms-wizard.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DeviceSetupPageComponent {
  // isBrowser: boolean;
  customerId: number = 0;
  locationId: number = 0;
  entranceID: number = 0;
  selectedGate: string = "";
  isPortalPartner: boolean = false;
  showLocationError: string = "none";

  formSubmitted = false;
  gates: IEntrance[] = [];
  locations: ILocation[] = [];

  devices = [{ "deviceId": "1", "deviceName": "Device 1", "macAddress": "00-14-22-01-23-45", "side": "left" },
  { "deviceId": "2", "deviceName": "Device 2", "macAddress": "00-14-22-01-23-46", "side": "right" }];

  @Output() formData = new EventEmitter<any>();

  // Form
  form: FormGroup;

  // Forms and active state for each step
  steps = [
    { form: undefined, current: true },
    { form: undefined, current: false },
    { form: undefined, current: false },
    { form: undefined, current: false },
    { form: undefined, current: false },
    { form: undefined, current: false },
    { form: undefined, current: false }
  ];

  // The current visible step
  currentStep = 0;

  // Progress var init
  progress = '0';

  constructor(fb: FormBuilder,
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
    private laneDeviceService: LaneDeviceService,
    private locationService: LocationService,
    private entranceService: EntranceService,
    private notificationService: NotificationService
  ) {
    // this.isBrowser = isPlatformBrowser(platformId);

    // Init for the form groups in each step of the wizard
    this.getAllLocations();
    this.steps[0].form = new FormGroup({
      location: new FormControl('')
    });

    this.steps[1].form = new FormGroup({

    });

    this.steps[2].form = new FormGroup({

    });
    this.steps[3].form = new FormGroup({

    });
    this.steps[4].form = new FormGroup({

    });
    this.steps[5].form = new FormGroup({

    });

    // Init the Main form with all the form groups of all the steps
    this.form = fb.group({
      step0FormGroup: this.steps[0].form,
      step1FormGroup: this.steps[1].form,
      step2FormGroup: this.steps[2].form,
      step3FormGroup: this.steps[3].form,
      step4FormGroup: this.steps[4].form,
      step5FormGroup: this.steps[5].form
    });
  }

  ngOnInit() {

  }

  // Change step function, to be called on the 'submission' of each step
  // 'change' indicates the length of the step
  changeStep(change: number): void {
    //alert("changeStep called");
    if (!this.formSubmitted) {
      // If we want to move forwards (change > 0) the previous steps must be valid
      change = this.validateSteps(this.currentStep, change);
      this.steps[this.currentStep].current = false;
      this.currentStep += change;
      this.steps[this.currentStep].current = true;
      this.progress = (Math.floor((this.currentStep / (this.steps.length - 1)) * 100)).toString();
    }
  }

  submitDevice(change: number, deviceId) {
    this.isPortalPartner = (deviceId == 2 ? true : false);
    let deviceObject = {
      id: deviceId,
      name: this.devices[deviceId - 1].deviceName,
      side: this.devices[deviceId - 1].side,
      macAddress: this.devices[deviceId - 1].macAddress
    };

    // this.laneDeviceService.putDevice(this.locationId, this.entranceID, deviceObject).subscribe(res => {
    //   if (res['status'] == 201) {
    //     this.notificationService.showNotification(deviceObject.name + " successfully registered.", 'top', 'center', '', 'info-circle');

    //     setTimeout(() => {
    //       this.changeStep(change);
    //     }, 3000);
    //   }
    //   else if (res['statusCode'] == 500) {
    //     this.notificationService.showNotification(res["data"], 'top', 'center', 'warning', 'info-circle');
    //   }
    // },
    //   err => {
    //     console.log("Error occurred: " + err.message);
    //     this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
    //   });
  }

  goToStep(step): void {
    this.changeStep(step - this.currentStep);
  }

  validateSteps(currentStep, change): number {
    this.steps[currentStep].form.markAsTouched();

    return (change);
  }

  // On submit to be called by the form submission
  doSubmit(): void {
    this.progress = '100'; // Update the progress bar
    this.currentStep++;
    this.formSubmitted = true;
    let data = {};
    if (this.validateSteps(this.currentStep, 1) === 1) {
      for (const formGroup in this.form.value) { // Get all the steps data together
        if (Object.prototype.hasOwnProperty.call(this.form.value, formGroup)) {
          const formData = this.form.value[formGroup].value;
          data = Object.assign(data, formData);
        }
      }
      this.formData.emit(data); // Emit the complete data set
      this.progress = '100'; // Update the progress bar
      this.currentStep++;
      // this.formSubmitted = true;
    }
  }

  getAllLocations() {
    this.locationService.getLocationByCustomerId(this.customerId).subscribe(res => {
      this.locations = res;

      // this.form.patchValue({
      //   location: this.locations[0].id
      // });
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  getAllDevices(locationid: number, entranceID: number) {
    let devices: IDevice[] = [];
    for (var i = 1; i <= 2; i++) {
      this.laneDeviceService.getDevice( i).subscribe(res => {
        let device: IDevice = res["data"];
        devices.push(device);
        console.log(JSON.stringify(res));
      },
        err => {
          console.log("Error occurred: " + err.message);
        });
    }
  }

  selectLocation() {
    this.locationId = this.steps[0].form.controls["location"].value;
    if (this.locationId > 0) {
      this.showLocationError = "none";
      this.entranceService.getEntranceByLocationId(this.locationId).subscribe(res => {
        this.gates = res;

        this.changeStep(1);
      },
        err => {
          console.log("Error occurred: " + err.message);
        });
    }
    else {
      this.showLocationError = "block";
    }
  }

  selectGate(gateId: number, gateName: string) {
    this.entranceID = gateId
    this.selectedGate = gateName;
    // this.getAllDevices(this.locationId, this.entranceID);

    this.changeStep(1);
  }
}