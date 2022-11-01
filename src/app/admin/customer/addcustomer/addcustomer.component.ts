import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../../assets/services/customer.service';
import { ICustomer } from '../../../../assets/interfaces/icustomer';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';

var $ = require('jquery');

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.scss'],
  providers: [DatePipe]
})
export class AddcustomerComponent implements OnInit {
  customers: ICustomer[] = [];
  // Form validation messages
  validationMessages = {
    name: [
      { type: 'required', message: 'This field is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be valid.' }
    ],

  };

  // Full form
  form: FormGroup;
  progress = '0';

  constructor(public formBuilder: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public datepipe: DatePipe
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);

    this.form = formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([

        Validators.email,
        Validators.required
      ]))
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
      name: this.form.controls["name"].value,
      email: this.form.controls["email"].value,
    };

    this.customerService.createCustomer(customerObject).subscribe(res => {
      if (res['status'] == 201) {
        let response: ICustomer = res;

        // this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
        //   this.notificationService.showNotification(text + this.formatDate(new Date(response.updateTimestamp)), 'top', 'center', '', 'info-circle');
        // });
        this.notificationService.showNotification("Customer created successfully", 'top', 'center', '', 'info-circle');

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
    this.router.navigate(['./admin/customer']);
  }

  formatDate = function (date: Date) {
    return this.datepipe.transform(date, 'MM-dd-yyyy hh:mm');
  }
}
