import { Component, OnInit } from '@angular/core';
// import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../../assets/services/location.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ILocation } from '../../../../assets/interfaces/ilocation';
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { CustomerService } from '../../../../assets/services/customer.service';

var $ = require('jquery');

@Component({
  selector: 'app-addlocation',
  templateUrl: './addlocation.component.html',
  styleUrls: ['./addlocation.component.scss'],
  providers: [DatePipe]
})
export class AddlocationComponent implements OnInit {
  location: ILocation[] = [];
  customers: ICustomer[] = [];

  validationMessages = {
    name: [
      { type: 'required', message: 'This field is required.' }
    ],
    customerDrp: [
      { type: 'required', message: 'This field is required.' }
    ]
  };

  // Full form
  form: FormGroup;
  progress = '0';

  constructor(public formBuilder: FormBuilder,
    private locationService: LocationService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public datepipe: DatePipe,
    private customerService: CustomerService) {
      translate.setDefaultLang(ActivityConstants.browserLanguage);
      this.translateValidationMessages();

    this.form = formBuilder.group({
      name: new FormControl('', Validators.required),
      customerDrp: new FormControl('', Validators.required)
    });

    this.customerService.getCustomers().subscribe(res => {
      if (res["status"] == 200) {
        this.customers = res["data"];
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
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
      customerId: this.form.controls["customerDrp"].value,
      name: this.form.controls["name"].value
    };

    this.locationService.addLocation(locationObject).subscribe(res => {
      if (res['status'] == 201) {
        let response: ILocation = res;

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification("Location created successfully", 'top', 'center', '', 'info-circle');
        });

        setTimeout(() => {
          this.close();
        }, 3000);
      }
      else if (res['status'] == 500) {
        this.translate.get('msgInternalError').subscribe((text: string) => {
          this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
        });
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

  close() {
    this.router.navigate(['./admin/location']);
  }

  formatDate = function (date: Date) {
    return this.datepipe.transform(date, 'MM-dd-yyyy hh:mm');
  }
}
