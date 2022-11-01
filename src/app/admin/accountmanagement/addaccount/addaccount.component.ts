import { Component, Inject, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TextValidator } from '../.../../../../../assets/common/text.validator';
import { IRoles } from '../../../../assets/interfaces/iroles';

const moment = _moment;

var $ = require('jquery');

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./styles/addaccount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class AddaccountComponent implements OnInit {
  user: IUser = {};
  isPasswordValid: boolean = true;
  isEmailValid: boolean = true;

  // Form validation messages
  validationMessages = {
    firstName: [
      { type: 'required', message: 'This field is required.' },
      { type: 'cannotContainSpace', message: 'This field can not contain space.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be valid.' }
    ],
    confirmemail: [
      { type: 'required', message: 'email must be same.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' }
    ],
    confirmpassword: [
      { type: 'required', message: 'Password must be same.' }
    ],
    equal: [
      { type: 'areEqual', message: 'This fields should be equal.' }
    ],
    terms: [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
    role: [
      { type: 'required', message: 'Role is required.' }
    ],
    expiryDate: [
      { type: 'required', message: 'Expiration date is required.' },
      { type: 'valid', message: 'Please ensure that the expiration date is greater than the current Date.' }
    ],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    textNumber: [
      { type: 'pattern', message: 'Number must be an integer.' }
    ],
    minLength: [
      { type: 'minlength', message: 'Min length is 11.' }
    ],
    maxLength: [
      { type: 'maxlength', message: 'Max length is 8.' }
    ],
    range: [
      { type: 'range', message: 'Range should be a number between 5 and 10.' }
    ],
    minValue: [
      { type: 'min', message: 'Min value is 4.' }
    ],
    maxValue: [
      { type: 'max', message: 'Max value is 5.' }
    ]
  };

  userRoles = [{ "id": "", "role": "Select a Role" }/*,
  { "id": "BASIC", "role": "Basic" },
  { "id": "ADVANCE", "role": "Advance" }*/
];
  expiryDays = [1, 2, 7, 30];

  // Full form
  form: FormGroup;
  progress = '0';
  disableSelect = new FormControl(false);

  @ViewChild("passcode1", { static: false }) passcode1Ref: ElementRef;
  @ViewChild("passcode2", { static: false }) passcode2Ref: ElementRef;
  @ViewChild("passcode3", { static: false }) passcode3Ref: ElementRef;
  @ViewChild("passcode4", { static: false }) passcode4Ref: ElementRef;

  @ViewChild("confPasscode1", { static: false }) confPasscode1Ref: ElementRef;
  @ViewChild("confPasscode2", { static: false }) confPasscode2Ref: ElementRef;
  @ViewChild("confPasscode3", { static: false }) confPasscode3Ref: ElementRef;
  @ViewChild("confPasscode4", { static: false }) confPasscode4Ref: ElementRef;

  expiryDateU: number = 0;
  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  expiryDay: number = this.currentDate.getDate() + environment.expiryDays;
  isValidExpiryDate: number = 0;
  date: Date;

  constructor(
    public formBuilder: FormBuilder,
    // private http: HttpClient,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public datepipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.translateValidationMessages();
    this.date = new Date();
    this.date.setFullYear(this.date.getFullYear() + 1);
    this.form = formBuilder.group({
      // firstName: new FormControl('', Validators.required),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), TextValidator.cannotContainSpace]),
      lastName: new FormControl(''),
      email: new FormControl('', Validators.compose([
        // Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),

      confirmemail: new FormControl('', Validators.compose([
        //Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),
      password1: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      password2: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      password3: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      password4: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),

      confirmPassword1: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      confirmPassword2: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      confirmPassword3: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      confirmPassword4: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      role: new FormControl('', Validators.required),
      // expiryDays: new FormControl('1')
      // expiryDate: new FormControl(moment([this.currYear, this.currMonth, this.expiryDay]))
      // expiryDate: new FormControl('', Validators.required)
      expiryDate: new FormControl(this.date)
    });

    this.form.valueChanges.subscribe(form => { this.dateFilter(form); });
  }

  ngOnInit() {
    this.getRoleModule();
    this.changeRole("BASIC");
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

  dateFilter(form): void {
    this.expiryDateU = new Date(this.datepipe.transform(form.expiryDate, 'yyyy-MM-dd')).getTime();
    this.isValidExpiryDate = 0;

    if (this.form.controls["role"].value == "BASIC" || this.form.controls["role"].value == "technicianltd" || this.form.controls["role"].value == "techniciancust") {
      if (this.expiryDateU == 0) {
        this.isValidExpiryDate = 2;
      }
      else {
        this.expiryDateU = this.expiryDateU + (new Date().getTimezoneOffset() * 60000);

        let currDate: any = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
        let expDate: any = new Date(this.datepipe.transform(form.expiryDate, 'yyyy-MM-dd'));

        if (expDate < currDate) {
          this.isValidExpiryDate = 1;
        }
      }
    }
  }

  onSubmit(isCreateANother: boolean = false) {
    this.spinnerService.show();
    let expiryDay: number = 0;

    if (this.form.controls["role"].value == "ADVANCE") {
      expiryDay = environment.expiryDays;
    }

    let userObject = {
      firstName: this.form.controls["firstName"].value,
      lastName: this.form.controls["lastName"].value,
      email: this.form.controls["email"].value,
      confirmemail: this.form.controls["confirmemail"].value,

      password: this.form.controls["confirmPassword1"].value.toString() + this.form.controls["confirmPassword2"].value.toString() + this.form.controls["confirmPassword3"].value.toString() + this.form.controls["confirmPassword4"].value.toString(),
      // roleId: this.form.controls["role"].value,
      roleName: this.form.controls["role"].value,
      expiryDays: expiryDay,
      expiryDate: this.expiryDateU
    };

    this.userService.registerUser(userObject).subscribe(res => {
      if (res['status'] == 201) {
        this.spinnerService.hide();
        let response: IUser = res["data"];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification("User created successfully", 'top', 'center', '', 'info-circle');
        });

        if (!isCreateANother) {
          setTimeout(() => {
            this.router.navigate(['/admin/accountmanagement']);
          }, 3000);
        }
        else {
          this.form.reset();
          this.form.patchValue({
            role: "",
            expiryDate: ""
          });
        }
      }
      else if (res['status'] == 500) {
        this.spinnerService.hide();
        // let response: IUser = res["data"];
        // localStorage.setItem("id", response.id);
        //already exists
        // this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        this.translate.get('lblAlreadyAcc').subscribe((text: string) => {
          this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
        });
        // this.translate.get('msgInternalError').subscribe((text: string) => {
        //   this.notificationService.showNotification(text + this.formatDate(new Date(response.creationTimestamp)), 'top', 'center', 'warning', 'info-circle');
        // });
      }
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
      });
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

  formatDate = function (date: Date) {
    return this.datepipe.transform(date, 'MM-dd-yyyy hh:mm');
  }

  comparePassword() {
    this.form.controls['confirmPassword4'].setErrors(null);
    this.isPasswordValid = true;
    let password: string = this.form.controls["password1"].value.toString() + this.form.controls["password2"].value.toString() + this.form.controls["password3"].value.toString() + this.form.controls["password4"].value.toString();
    let confirmPassword: string = this.form.controls["confirmPassword1"].value.toString() + this.form.controls["confirmPassword2"].value.toString() + this.form.controls["confirmPassword3"].value.toString() + this.form.controls["confirmPassword4"].value.toString();

    if (password != confirmPassword) {
      this.isPasswordValid = false;
      this.form.controls['confirmPassword4'].setErrors({ 'incorrect': true });
    }
  }

  compareEmail() {
    this.form.controls['confirmemail'].setErrors(null);
    this.isEmailValid = true;
    let Email: string = this.form.controls["email"].value;
    let confirmEmail: string = this.form.controls["confirmemail"].value;

    if (Email != confirmEmail) {
      this.isEmailValid = false;
      this.form.controls['confirmemail'].setErrors({ 'incorrect': true });
    }
  }
  changeRole(val) {
    if (val == "ADVANCE") {
      $(".basic-user").each(function () {
        $(this).hide();
      });
    }
    else {
      $(".basic-user").each(function () {
        $(this).show();
      });
    }
  }

  nextFocus(id, event) {
    let controlId = "password" + (parseInt(id) - 1);
    if (parseInt(id) > 5) {
      controlId = "confirmPassword" + (parseInt(id) - 5);
    }
    if (event.key != "Backspace" && this.form.controls[controlId].value.toString().length == 1) {
      switch (id) {
        case "1":
          this.passcode1Ref.nativeElement.focus();
          break;
        case "2":
          this.passcode2Ref.nativeElement.focus();
          break;
        case "3":
          this.passcode3Ref.nativeElement.focus();
          break;
        case "4":
          this.passcode4Ref.nativeElement.focus();
          break;
        case "5":
          this.confPasscode1Ref.nativeElement.focus();
          break;
        case "6":
          this.confPasscode2Ref.nativeElement.focus();
          break;
        case "7":
          this.confPasscode3Ref.nativeElement.focus();
          break;
        case "8":
          this.confPasscode4Ref.nativeElement.focus();
          break;
      }
    }
    else if (this.form.controls[controlId].value == null && event.key == "Backspace") {
      switch (id) {
        case "9":
          this.confPasscode3Ref.nativeElement.focus();
          break;
        case "8":
          this.confPasscode2Ref.nativeElement.focus();
          break;
        case "7":
          this.confPasscode1Ref.nativeElement.focus();
          break;

        case "6":
          this.passcode4Ref.nativeElement.focus();
          break;
        case "5":
          this.passcode3Ref.nativeElement.focus();
          break;
        case "4":
          this.passcode2Ref.nativeElement.focus();
          break;
        case "3":
          this.passcode1Ref.nativeElement.focus();
          break;
      }
    }
  }

  createAnother() {
    this.onSubmit(true);
  }

  translateValidationMessages() {
    this.translate.get('requiredfield').subscribe((text: string) => {
      this.validationMessages.firstName[0].message = text;
    });

    this.translate.get('requiredemail').subscribe((text: string) => {
      this.validationMessages.email[0].message = text;
    });

    this.translate.get('validemail').subscribe((text: string) => {
      this.validationMessages.email[1].message = text;
    });

    this.translate.get('requiredconfirmemail').subscribe((text: string) => {
      this.validationMessages.confirmemail[0].message = text;
    });

    this.translate.get('requiredpassword').subscribe((text: string) => {
      this.validationMessages.password[0].message = text;
    });

    this.translate.get('requiredconfirmpassword').subscribe((text: string) => {
      this.validationMessages.confirmpassword[0].message = text;
    });

    this.translate.get('requiredrole').subscribe((text: string) => {
      this.validationMessages.role[0].message = text;
    });

    this.translate.get('requiredexpirationdate').subscribe((text: string) => {
      this.validationMessages.expiryDate[0].message = text;
    });

    this.translate.get('validexpirationdate').subscribe((text: string) => {
      this.validationMessages.expiryDate[1].message = text;
    });
  }

  getRoleModule(){
    try{
      this.userService.getRole().subscribe(res => {
        if (res["status"] == 200) {
          let roles: IRoles[] = res["data"];
          if (roles.length > 0) {
            roles.forEach(e=>{
              this.userRoles.push({"id":e.roleName,"role":e.roleName.toUpperCase()});
            });
          }
        }
      },
      err => {
        console.log("Error occurred: " + err.message);
      });
    }
    catch(e){
      console.log(e.message);
    }
  }
}