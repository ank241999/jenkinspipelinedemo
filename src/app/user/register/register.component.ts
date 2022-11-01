import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../assets/services/notification.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { IAuth } from '../../../assets/interfaces/iauth';
import { LocationService } from '../../../assets/services/location.service';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TermsComponent } from '../terms/terms.component';
var jwtDecode = require('jwt-decode');

var $ = require('jquery');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../styles.css']
})
export class RegisterComponent implements OnInit {
  users: IUser[] = [];
  iAuth: IAuth = {};
  registerForm: FormGroup;
  progress = '0';

  // Form validation messages
  validationMessages = {
    firstName: [
      { type: 'required', message: 'First name is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be valid.' }
    ],
    confirmemail: [
      { type: 'required', message: 'Confirm Email is required.' },
      { type: 'email', message: 'Confirm Email must be valid.' }
    ],
    passcode: [
      { type: 'required', message: 'Passcode is required.' }
    ],
    confPasscode: [
      { type: 'required', message: 'Confirm Passcode is required.' }
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

  translateValidationMessages() {
    this.translate.get('requiredfirstname').subscribe((text: string) => {
      this.validationMessages.firstName[0].message = text;
    });

    this.translate.get('requireemail').subscribe((text: string) => {
      this.validationMessages.email[0].message = text;
    });

    this.translate.get('validemail1').subscribe((text: string) => {
      this.validationMessages.email[1].message = text;
    });

    this.translate.get('requireconfirmemail').subscribe((text: string) => {
      this.validationMessages.confirmemail[0].message = text;
    });

    this.translate.get('requirevalidconfirmemail').subscribe((text: string) => {
      this.validationMessages.confirmemail[1].message = text;
    });
  }

  @ViewChild("firstName", { static: false }) firstNameRef: ElementRef;
  @ViewChild("passcode1", { static: false }) passcode1Ref: ElementRef;
  @ViewChild("passcode2", { static: false }) passcode2Ref: ElementRef;
  @ViewChild("passcode3", { static: false }) passcode3Ref: ElementRef;
  @ViewChild("passcode4", { static: false }) passcode4Ref: ElementRef;

  @ViewChild("confPasscode1", { static: false }) confPasscode1Ref: ElementRef;
  @ViewChild("confPasscode2", { static: false }) confPasscode2Ref: ElementRef;
  @ViewChild("confPasscode3", { static: false }) confPasscode3Ref: ElementRef;
  @ViewChild("confPasscode4", { static: false }) confPasscode4Ref: ElementRef;

  logoImagePath: string = "/assets/images/Liberty-Defense-Logo-.png";

  constructor(private userService: UserService, private router: Router, private translate: TranslateService, private notificationService: NotificationService,
    public datepipe: DatePipe, private locationService: LocationService, private shareDataService: ShareDataService, public formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.translateValidationMessages();
    document.body.style.background = '#EBEBEB';
    if (shareDataService.logoImagePath != null && shareDataService.logoImagePath != "") {
      this.logoImagePath = shareDataService.logoImagePath;
    }

    this.registerForm = formBuilder.group({
      // registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),//, Validators.minLength(4), Validators.maxLength(50)]),
      lastName: new FormControl('', Validators.required),//, Validators.minLength(4), Validators.maxLength(50)]),

      // email: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      // confirmEmail: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      confirmEmail: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),

      passcode1: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),
      passcode2: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),
      passcode3: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),
      passcode4: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),

      confPasscode1: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),
      confPasscode2: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),
      confPasscode3: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')]),
      confPasscode4: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[0-9]*')])
    });
  }

  ngOnInit() {
    $("#firstName").focus();

    // this.firstNameRef.nativeElement.focus();
  }

  onSubmit() {
    this.spinnerService.show();

    let userObject = {
      firstName: this.registerForm.controls["firstName"].value,
      lastName: this.registerForm.controls["lastName"].value,
      email: this.registerForm.controls["confirmEmail"].value,
      password: this.registerForm.controls["confPasscode1"].value.toString() + this.registerForm.controls["confPasscode2"].value.toString() + this.registerForm.controls["confPasscode3"].value.toString() + this.registerForm.controls["confPasscode4"].value.toString(),
      // roleId: 1,
      roleName: "BASIC",
      expiryDays: environment.expiryDays
      // isAgree: isAgree,
      // languageCode: langCode
    };

    this.userService.registerUser(userObject).subscribe(res => {
      if (res['status'] == 201) {
        this.shareDataService.locale = ActivityConstants.getLocale();
        //this.getLocation();

        let response: IUser = res["data"];
        this.shareDataService.id = response.id;
        this.userService.loginLog();
        this.spinnerService.hide();

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification(text + this.formatDate(new Date(response.expiryTimestamp)), 'top', 'center', '', 'info-circle');
        });

        setTimeout(() => {
          this.login();
        }, 4000);
      }
      else if (res['status'] == 500) {
        this.spinnerService.hide();
        this.translate.get('lblAlreadyAcc').subscribe((text: string) => {
          this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
        });
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
      });
  }

  login() {
    let userObject = {
      device: "pc",
      email: this.registerForm.controls["confirmEmail"].value,
      password: this.registerForm.controls["confPasscode1"].value.toString() + this.registerForm.controls["confPasscode2"].value.toString() + this.registerForm.controls["confPasscode3"].value.toString() + this.registerForm.controls["confPasscode4"].value.toString(),
    };
    this.userService.loginUser(userObject).subscribe(res => {
      if (res && res["access_token"]) {
        this.shareDataService.currentUser = res["access_token"];
        this.shareDataService.refreshToken = res["refresh_token"];
        // this.shareDataService.id = "1";
        this.getLocation();
        
        this.iAuth = jwtDecode(res["access_token"]);
        this.shareDataService.email = this.iAuth.email;
        this.shareDataService.role = "basic";

        //this.router.navigate(['./admin/activitymonitoring']);
        //this.router.navigate(['./terms']);
        this.router.navigateByUrl('/?isskip=1', { skipLocationChange: true }).then(() => {
          this.router.navigate(['./terms']);
        });
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
      });
  }

  focusOut(id) {
    if (id == "email") {
      this.emailTickWrongShowHide(false, false);
      // this.registerForm.controls['confirmEmail'].setErrors(null);

      $("#emailTickRight").css("display", "inline");

      if (this.registerForm.controls["email"].value != this.registerForm.controls["confirmEmail"].value) {
        this.emailTickWrongShowHide(true, false);
        this.registerForm.controls['confirmEmail'].setErrors({ 'incorrect': true });
      }

      if (!this.registerForm.controls["email"].valid) {
        $("#emailTickWrong").css("display", "inline");
        $("#emailTickRight").css("display", "none");
      }
      else {
        $("#emailTickWrong").css("display", "none");
      }

    }
    else if (id == "passcode") {
      this.passcodeTickWrongShowHide(false, true);

      // this.registerForm.controls['confPasscode4'].setErrors(null);

      let passcode: string = this.registerForm.controls["passcode1"].value.toString() + this.registerForm.controls["passcode2"].value.toString() + this.registerForm.controls["passcode3"].value.toString() + this.registerForm.controls["passcode4"].value.toString()
      let confirmPasscode: string = this.registerForm.controls["confPasscode1"].value.toString() + this.registerForm.controls["confPasscode2"].value.toString() + this.registerForm.controls["confPasscode3"].value.toString() + this.registerForm.controls["confPasscode4"].value.toString()
      if (passcode.trim() != "" && confirmPasscode.trim() != "") {
        if (passcode.trim() != confirmPasscode.trim()) {
          this.passcodeTickWrongShowHide(true, false);

          if (this.registerForm.controls["email"].value == this.registerForm.controls["confirmEmail"].value && this.registerForm.controls["confirmEmail"].valid) {
            setTimeout(() => {
              this.clearControls();

              this.passcodeTickWrongShowHide(false, false);
            }, 4000);
          }

          this.registerForm.controls['confPasscode4'].setErrors({ 'incorrect': true });
        }
      }
      else if (confirmPasscode.trim() == "") {
        $("#passcodeTickRight").css("display", "none");
        $("#passcodeTickWrong").css("display", "inline");
        this.clearControls();
        this.registerForm.controls['confPasscode4'].setErrors({ 'incorrect': true });
      }
      else {
        $("#passcodeTickRight").css("display", "none");
      }
    }
  }

  nextFocus(id, event) {
    let controlId = "passcode" + (parseInt(id) - 1);
    if (parseInt(id) > 5) {
      controlId = "confPasscode" + (parseInt(id) - 5);
    }
    if (event.key != "Backspace" && this.registerForm.controls[controlId].value.toString().length == 1) {
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
    else if (this.registerForm.controls[controlId].value == null && event.key == "Backspace") {
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

    this.passcodeTickWrongShowHide(false, false);
  }

  navigateLogin = function () {
    this.router.navigate(['/']);
  }

  formatDate = function (date: Date) {
    return this.datepipe.transform(date, 'MM-dd-yyyy hh:mm');
  }

  clearControls() {
    this.passcode1Ref.nativeElement.focus();
    this.registerForm.controls["passcode1"].setValue("");
    this.registerForm.controls["passcode2"].setValue("");
    this.registerForm.controls["passcode3"].setValue("");
    this.registerForm.controls["passcode4"].setValue("");
    this.registerForm.controls["confPasscode1"].setValue("");
    this.registerForm.controls["confPasscode2"].setValue("");
    this.registerForm.controls["confPasscode3"].setValue("");
    this.registerForm.controls["confPasscode4"].setValue("");
  }

  emailTickWrongShowHide(isShow: boolean, isShowRightTick: boolean) {
    if (isShow) {
      $("#emailTickWrong").css("display", "inline");
      $("#emailToolTip").show();
    }
    else {
      $("#emailTickWrong").css("display", "none");
      $("#emailToolTip").hide();
    }

    if (isShowRightTick) {
      $("#emailTickRight").css("display", "inline");
    }
    else {
      $("#emailTickRight").css("display", "none");
    }
  }

  passcodeTickWrongShowHide(isShow: boolean, isShowRightTick: boolean) {
    if (isShow) {
      $("#passcodeTickWrong").css("display", "inline");
      $("#passcodeToolTip").show();
    }
    else {
      $("#passcodeTickWrong").css("display", "none");
      $("#passcodeToolTip").hide();
    }

    if (isShowRightTick) {
      $("#passcodeTickRight").css("display", "inline");
    }
    else {
      $("#passcodeTickRight").css("display", "none");
    }
  }

  getLocation() {
    this.locationService.getLocationById(1).subscribe(res => {
      if (res["status"] == 200) {
        let loc: ILocation = res["data"];

        this.shareDataService.logoImageName = loc.logoImageName;
        this.shareDataService.logoImagePath = loc.logoImagePath;
        this.shareDataService.footPrintImageName = loc.footPrintImageName;
        this.shareDataService.footPrintImagePath = loc.footPrintImagePath;

        this.shareDataService.setApplicationVariables();
        this.spinnerService.hide();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  validateFields(): void {
    if (!this.registerForm.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.registerForm.markAsTouched();
      for (const control in this.registerForm.controls) {
        if (this.registerForm.controls.hasOwnProperty(control)) {
          this.registerForm.controls[control].markAsTouched();
          this.registerForm.controls[control].markAsDirty();
        }
      }
    }
  }

  updateProgress(): void {
    const controls = this.registerForm.controls;
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
}
