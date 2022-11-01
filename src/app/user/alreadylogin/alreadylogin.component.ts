import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../assets/services/notification.service';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { IAuth } from '../../../assets/interfaces/iauth';
import { environment } from '../../../environments/environment';
import { LocationService } from '../../../assets/services/location.service';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IRoleModule } from '../../../assets/interfaces/irolemodule';
var jwtDecode = require('jwt-decode');
var $ = require('jquery');

@Component({
  selector: 'app-alreadylogin',
  templateUrl: './alreadylogin.component.html',
  styleUrls: ['./alreadylogin.component.scss', '../styles.css']
})
export class AlreadyloginComponent implements OnInit {
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[] = [];
  users: IUser[] = [];
  alreadyLoggedInButtonText: string = "LOGOUT AT DEVICE ";
  id: string = "";
  roleId: number = 0;
  iAuth: IAuth = {};
  isAgree: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    passcode1: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
    passcode2: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
    passcode3: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
    passcode4: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)])
  });

  @ViewChild("passcode1", { static: false }) passcode1Ref: ElementRef;
  @ViewChild("passcode2", { static: false }) passcode2Ref: ElementRef;
  @ViewChild("passcode3", { static: false }) passcode3Ref: ElementRef;
  @ViewChild("passcode4", { static: false }) passcode4Ref: ElementRef;

  logoImagePath: string = "/assets/images/Liberty-Defense-Logo-.png";

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private translate: TranslateService,
    private notificationService: NotificationService, private locationService: LocationService,
    private shareDataService: ShareDataService, private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
    if (localStorage.getItem("logoImagePath") != null && localStorage.getItem("logoImagePath") != "") {
      this.logoImagePath = shareDataService.logoImagePath;
    }
  }

  ngOnInit() {
    $("#passcode1").focus();
    this.route.queryParams.subscribe(params => {
      let email = params["email"];
      let device = params["device"];
      this.id = params["id"];
      this.roleId = params["roleId"];
      this.isAgree = params["isAgree"];

      if (email) {
        this.loginForm.controls["email"].setValue(email);
      }
      if (device) {
        this.alreadyLoggedInButtonText = this.alreadyLoggedInButtonText + device;
      }
    });
  }

  // ngOnAfterInit(){
  //   this.passcode1Ref.nativeElement.focus();
  // }

  onSubmit() {
    this.spinnerService.show();
    let userObject = {
      device: "pc",
      email: this.loginForm.controls["email"].value,
      password: this.loginForm.controls["passcode1"].value.toString() + this.loginForm.controls["passcode2"].value.toString() + this.loginForm.controls["passcode3"].value.toString() + this.loginForm.controls["passcode4"].value.toString()
    };

    this.userService.logOutAll(userObject.email, userObject.password, userObject.device).subscribe(res => {
      if (res && res["access_token"]) {
        this.shareDataService.clearSessionVariables();
        this.shareDataService.currentUser = res["access_token"];
        this.shareDataService.refreshToken = res["refresh_token"];
        this.shareDataService.id = this.id;

        this.shareDataService.locale = ActivityConstants.getLocale();
        this.getLocation();

        this.iAuth = jwtDecode(res["access_token"]);
        this.shareDataService.email = this.iAuth.email;

        var roles = this.iAuth.resource_access[environment.tokenVerifyClientId]["roles"];
        var rolesLowerCase = [];
        for (var i = 0; i < roles.length; i++) {
          rolesLowerCase.push(roles[i].toLowerCase());
        }

        this.userService.getUsers(this.iAuth.email).subscribe(res => {
          if (res["status"] == 200) {
            localStorage.setItem("notificationCount", "0");
            let users: IUser[] = res["data"];
            if (users.length > 0) {
              this.shareDataService.id = users[0].id;

              if (rolesLowerCase.indexOf("basic") > -1) {
                this.shareDataService.role = "basic";

                if (users[0].expiryTimestamp > new Date().getTime()) {
                  this.userService.loginLog();
                  this.getRoleModule(this.isAgree);
                }
                else {
                  this.notificationService.showNotification("Your login account has expired. Please contact to System Administrator.", 'top', 'center', 'warning', 'info-circle');
                }
              }
              else if (rolesLowerCase.indexOf("advance") > -1) {
                this.shareDataService.role = "advance";
                this.getRoleModule(this.isAgree);
                this.userService.loginLog();
              }
              else if (rolesLowerCase.indexOf("technicianltd") > -1) {
                this.shareDataService.role = "technicianltd";
                if (users[0].expiryTimestamp > new Date().getTime()) {
                  this.userService.loginLog();
                  this.getRoleModule(this.isAgree);
                }
                else {
                  this.notificationService.showNotification("Your login account has expired. Please contact to System Administrator.", 'top', 'center', 'warning', 'info-circle');
                }
              }
              else if (rolesLowerCase.indexOf("techniciancust") > -1) {
                this.shareDataService.role = "techniciancust";
                if (users[0].expiryTimestamp > new Date().getTime()) {
                  this.userService.loginLog();
                  this.getRoleModule(this.isAgree);
                }
                else {
                  this.notificationService.showNotification("Your login account has expired. Please contact to System Administrator.", 'top', 'center', 'warning', 'info-circle');
                }
              }
            }
          }
        },
          err => {
            console.log("Error occurred: " + err.message);
            this.spinnerService.hide();

            if (err["status"] == 401) {
              this.notificationService.showNotification(err["error"], 'top', 'center', 'danger', 'info-circle');
            }
            else if (err["status"] == 500) {
              this.clearPasscodes();
            }
          });
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
        this.clearPasscodes();
        this.passcode1Ref.nativeElement.focus();

        if (err["status"] == 401) {
          this.notificationService.showNotification(err["error"], 'top', 'center', 'danger', 'info-circle');
        }
        else if (err["status"] == 400) {
          this.notificationService.showNotification(err["error"], 'top', 'center', 'danger', 'info-circle');
        }
        else if (err["status"] == 500) {
          // this.translate.get('msgInternalError').subscribe((text: string) => {
          //   this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          // });
          $("#passcodeTickWrong").show();
          $("#passcodeToolTip").show();
        }
      });
  }

  getRoleModule(isAgree: boolean){
    try{
      this.userService.getRolebyname(this.shareDataService.role).subscribe(res => {
        if (res["status"] == 200) {
          localStorage.setItem("notificationCount", "0");
          let roleModule: IRoleModule[] = res["data"];
          if (roleModule.length > 0) {
            this.shareDataService.moduleName = roleModule[0].moduleName;

            if (isAgree == null || isAgree == false) {
              this.router.navigate(['./terms']);
            }
            else {
              //this.router.navigate(['./admin/dashboard']);
              this.router.navigate(['./' + this.shareDataService.moduleName]);
            } 
          }
        }
      },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 401) {
          this.notificationService.showNotification(err["error"], 'top', 'center', 'danger', 'info-circle');
        }
        else if (err["status"] == 500) {
          this.clearPasscodes();
        }
      });
    }
    catch(e){
      console.log(e.message);
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

        if (environment.isMobile) {
          this.shareDataService.setApplicationVariables();
        }

        this.spinnerService.hide();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  nextFocus(id, event) {
    let controlId = "passcode" + (parseInt(id) - 1);
    if (event.key != "Backspace" && this.loginForm.controls[controlId].value.toString().length == 1) {
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
      }
    }
    else if (this.loginForm.controls[controlId].value == null && event.key == "Backspace") {
      switch (id) {
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

    $("#passcodeTickWrong").hide();
    $("#passcodeToolTip").hide();
  }

  cancel() {
    this.router.navigate(['/']);
  }

  clearPasscodes() {
    this.loginForm.controls["passcode1"].setValue("");
    this.loginForm.controls["passcode2"].setValue("");
    this.loginForm.controls["passcode3"].setValue("");
    this.loginForm.controls["passcode4"].setValue("");
  }
}
