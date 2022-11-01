import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../../assets/services/customer.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../../assets/services/share-data.service';
var $ = require('jquery');

@Component({
  selector: 'app-modifycustomer',
  templateUrl: './modifycustomer.component.html',
  styleUrls: ['./modifycustomer.component.scss']
})
export class ModifycustomerComponent implements OnInit {
  customer: ICustomer = {};
  validationMessages = {
    name: [
      { type: 'required', message: 'This field is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be valid.' }
    ]
  };

  form: FormGroup;
  progress = '0';
  
  constructor(public formBuilder: FormBuilder,
    private customerService: CustomerService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private shareDataService: ShareDataService,
    private router: Router) {

    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.customer = shareDataService.getSharedData();
    shareDataService.setSharedData(null);

    this.form = formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.email,
        Validators.required
      ]))
    });

    this.form.patchValue({
      name: this.customer.name,
      email: this.customer.email,
    });
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
    let customerObject = {
      id: this.customer.id,
      name: this.form.controls["name"].value,
      email: this.form.controls["email"].value
    };

    this.customerService.updateCustomer(customerObject).subscribe(res => {
      if (res['status'] == 201) {
        // let response: ICustomer = res["data"];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification("Customer updated successfully", 'top', 'center', '', 'info-circle');
        });

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
    this.router.navigate(['./admin/customer']);
  }
}