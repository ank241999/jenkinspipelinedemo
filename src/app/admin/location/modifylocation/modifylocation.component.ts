import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ILocation } from '../../../../assets/interfaces/ilocation';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { LocationService } from '../../../../assets/services/location.service';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { CustomerService } from '../../../../assets/services/customer.service';

var $ = require('jquery');

@Component({
  selector: 'app-modifylocation',
  templateUrl: `./modifylocation.component.html`,
  // styleUrls: ['../addlocation/styles/controls-and-validations.scss']
  styleUrls: ['./modifylocation.component.scss']
})
export class ModifylocationComponent implements OnInit {
  location: ILocation = {};
  customers: ICustomer[] = [];
  validationMessages = {
    name: [
      { type: 'required', message: 'This field is required.' }
    ],
    customerDrp: [
      { type: 'required', message: 'This field is required.' }
    ]
  };
  form: FormGroup;
  progress = '0';
  disableSelect = new FormControl(false);

  constructor(public formBuilder: FormBuilder,
    // private http: HttpClient,
    private locationService: LocationService,
    // private dialogRef: MatDialogRef<ILocation>,
    // @Inject(MAT_DIALOG_DATA) data,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private shareDataService: ShareDataService,
    private router: Router,
    private customerService: CustomerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.translateValidationMessages();
    this.location = this.shareDataService.getSharedData();
    this.shareDataService.setSharedData(null);

    this.customerService.getCustomers().subscribe(res => {
      if (res["status"] == 200) {
        this.customers = res["data"];
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });

    this.form = formBuilder.group({
      name: new FormControl('', Validators.required),
      customerDrp: new FormControl('', Validators.required),
    });

    this.form.patchValue({
      name: this.location.name,
      customerDrp: this.location.customer.id
    });
  }

  ngOnInit() {
  }

  translateValidationMessages() {
    this.translate.get('requiredfield').subscribe((text: string) => {
      this.validationMessages.name[0].message = text;
    });
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

  updateProgress(): void {
    const controls = this.form.controls;
    let size = 0;
    let completed = 0;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        size++;
        const control = controls[key];
        if ((control.value) && (control.dirty) && (control.valid)) {
          completed++;
        }
      }
    }

    // Size - 4 to not consider the optional fields
    this.progress = (Math.floor((completed / (size - 4)) * 100)).toString();
  }

  onSubmit() {
    let locationObject = {
      id: this.location.id,
      customerId: this.form.controls["customerDrp"].value,
      name: this.form.controls["name"].value
    };

    this.locationService.updateLocation(locationObject.id,locationObject.name,locationObject.customerId,null).subscribe(res => {
      if (res['status'] == 200) {
        let response: ILocation = res["data"];

        // this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
        //   this.notificationService.showNotification("Location updated successfully", 'top', 'center', '', 'info-circle');
        // });
        this.notificationService.showNotification("Location updated successfully", 'top', 'center', '', 'info-circle');

        setTimeout(() => {
          this.close();
        }, 3000);
      }
      else if (res['statusCode'] == 500) {
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
      }
    },
      err => {
        console.log("Error occurred: " + err.message);

        if (err["status"] == 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          });
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      });
  }

  formatDate = function (date: Date) {
    return (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) +
      "-" + (date.getDay() < 10 ? "0" + date.getDay() : date.getDay()) +
      "-" + date.getFullYear() + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
  }
  close() {
    this.router.navigate(['./admin/location']);
  }
}
