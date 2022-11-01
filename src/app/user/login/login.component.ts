import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, first } from 'rxjs/operators';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router } from '@angular/router';
import { NotificationService } from '../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { HttpClient } from '@angular/common/http';
import { IAuth } from '../../../assets/interfaces/iauth';
import { environment } from '../../../environments/environment';
import { LocationService } from '../../../assets/services/location.service';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ServerURLComponent } from '../../../app/user/login/server-url/server-url.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IUserLoginLog } from '../../../assets/interfaces/iuserloginlog';
import { IRoleModule } from '../../../assets/interfaces/irolemodule';

var jwtDecode = require('jwt-decode');
var $ = require('jquery');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../styles.css']
})
export class LoginComponent implements OnInit {
  isForgotPassword: boolean = false;
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[] = [];
  users: IUser[] = [];
  showIt: boolean = false;
  iAuth: IAuth = {};
  isPaste: boolean = false;

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

  @ViewChild("email", { static: false }) emailRef: ElementRef;
  @ViewChild("passcode1", { static: false }) passcode1Ref: ElementRef;
  @ViewChild("passcode2", { static: false }) passcode2Ref: ElementRef;
  @ViewChild("passcode3", { static: false }) passcode3Ref: ElementRef;
  @ViewChild("passcode4", { static: false }) passcode4Ref: ElementRef;

  logoImagePath: string = "/assets/images/Liberty-Defense-Logo-.png";
  isMobile: boolean = false;

  constructor(private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public http: HttpClient,
    private locationService: LocationService,
    public dialog: MatDialog,
    private shareDataService: ShareDataService,
    private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    // localStorage.setItem("disableBeta","false");    
  }

  ngOnInit() {
    localStorage.clear();
    $("#email").focus();
    this.shareDataService.setApplicationVariables();

    if (this.shareDataService.logoImagePath) {
      this.logoImagePath = this.shareDataService.logoImagePath;
    }

    this.loginForm.controls["email"].valueChanges
      .subscribe(
        email => {
          if (this.isPaste == false) {
            $(".autocomplete_container").show();
            console.log('email changed:' + email);
            if (this.loginForm.controls["email"].valid) {
              this.focusOut(true);
            }
            if ($("#email").val() == "") {
              $(".icon_tickcross").hide();
              $("#emailToolTip").hide();
            }
          }
        });

    this.filteredOptions = this.loginForm.controls["email"].valueChanges
      .pipe(
        startWith(''),
        //map(value => this.emailFilter(value)) 
        map(val => val.length >= 1 && val != "" ? this.emailFilter(val) : [])
      );

    this.isMobile = environment.isMobile;
    if (environment.isMobile && this.shareDataService.serverUrl == null) {
      // this.openAddDialog();
    }
  }

  emailFilter(value: string): IUser[] {
    const filterValue = (value == undefined ? "" : value.toLowerCase());
    this.userService.getUsers(filterValue).subscribe(res => {
      this.users = res["data"];
    },
      err => {
        console.log("Error occurred: " + err.message);
      });

    return (filterValue == "" ? [] : (this.users.length > 0 ? this.users.filter(a => a.email.toLowerCase().includes(filterValue)) : []));//.slice(0,4);
  }

  onSubmit() {
    this.spinnerService.show();
    let userObject = {
      device: "pc",
      email: this.loginForm.controls["email"].value,
      password: this.loginForm.controls["passcode1"].value.toString() + this.loginForm.controls["passcode2"].value.toString() + this.loginForm.controls["passcode3"].value.toString() + this.loginForm.controls["passcode4"].value.toString()
    };
    //
    // this.shareDataService.role = "advance";
    // this.shareDataService.logoImageName = "";//loc.logoImageName;
    // this.shareDataService.logoImagePath = "";//loc.logoImagePath;
    // this.shareDataService.footPrintImageName = "";//loc.footPrintImageName;
    // this.shareDataService.footPrintImagePath = "";//loc.footPrintImagePath;

    // this.shareDataService.setApplicationVariables();
    // this.spinnerService.hide();

    // this.router.navigate(['./admin/dashboard']);
    //
    this.userService.loginUser(userObject).subscribe(res => {
      if (res && res["access_token"]) {
        this.shareDataService.currentUser = res["access_token"];
        this.shareDataService.refreshToken = res["refresh_token"];
        this.shareDataService.id = "1";

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
                  this.getRoleModule(users[0]);
                }
                else {
                  this.notificationService.showNotification("Your login account has expired. Please contact to System Administrator.", 'top', 'center', 'warning', 'info-circle');
                }
              }
              else if (rolesLowerCase.indexOf("advance") > -1) {
                this.shareDataService.role = "advance";
                this.getRoleModule(users[0]);
                this.userService.loginLog();
              }
              else if (rolesLowerCase.indexOf("technicianltd") > -1) {
                this.shareDataService.role = "technicianltd";
                if (users[0].expiryTimestamp > new Date().getTime()) {
                  this.userService.loginLog();
                  this.getRoleModule(users[0]);
                }
                else {
                  this.notificationService.showNotification("Your login account has expired. Please contact to System Administrator.", 'top', 'center', 'warning', 'info-circle');
                }
              }
              else if (rolesLowerCase.indexOf("techniciancust") > -1) {
                this.shareDataService.role = "techniciancust";
                if (users[0].expiryTimestamp > new Date().getTime()) {
                  this.userService.loginLog();
                  this.getRoleModule(users[0]);
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

        // if (rolesLowerCase.indexOf("basic") > -1) {
        //   this.shareDataService.role = "basic";
        // }
        // else if (rolesLowerCase.indexOf("advance") > -1) {
        //   this.shareDataService.role = "advance";
        //   this.router.navigate(['./admin/dashboard']);
        // }
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
        else if (err["status"] == 500) {
          // this.translate.get('msgInternalError').subscribe((text: string) => {
          //   this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          // });
          $("#passcodeToolTip").show();
          $("#passcodeTickWrong").css("display", "block");
        }
      });
  }

  getRoleModule(users: IUser){
    try{
      this.userService.getRolebyname(this.shareDataService.role).subscribe(res => {
        if (res["status"] == 200) {
          localStorage.setItem("notificationCount", "0");
          let roleModule: IRoleModule[] = res["data"];
          if (roleModule.length > 0) {
            this.shareDataService.moduleName = roleModule[0].moduleName;

            if (users.isAgree == null || users.isAgree == false) {
              this.router.navigate(['./terms']);
            }
            else {
              //this.router.navigate(['./admin/activitymonitoring']);
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

        this.shareDataService.setApplicationVariables();
        this.spinnerService.hide();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  navigateRegister() {
    localStorage.setItem("notificationCount", "0");
    if (!this.isForgotPassword) {
      if (this.selectedUser.length > 0) {
        if (this.selectedUser[0].loggedIn) {
          this.userService.deleteUser([parseInt(this.selectedUser[0].id)]).subscribe(res => {
            if (res['status'] == 200) {
              this.cancel();
              this.isForgotPassword = false;
            }
            // else if (res['status'] == 401){

            // }
          },
            err => {
              console.log("Error occurred: " + err.message);
              this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
            });
        }
      }
    }
    this.router.navigate(['register']);
  }

  onPaste(event: ClipboardEvent) {
    this.isPaste = true;
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    var maxTry: number = 1;
    var root = this;
    let delay = 600;

    setTimeout(function request() {
      maxTry = maxTry + 1;
      if (root.users.length == 0 && maxTry < 4) {
        setTimeout(request, delay);
      } else {
        root.isPaste = false;
        root.loginForm.controls["email"].setValue(pastedText);
      }
    }, delay);
  }

  autofill(val: any) {
    this.loginForm.controls["email"].setValue(val);
    $(".autocomplete_container").hide();
    this.passcode1Ref.nativeElement.focus();
  }

  focusOut(isManualfil: boolean) {
    $("#passcodeToolTip").hide();
    $("#emailToolTip").hide();
    $("#passcodeTickWrong").css("display", "none");
    this.clearPasscodes();

    if (this.loginForm.controls["email"].value == "") {
      $("#emailTickRight").css("display", "none");
      $("#emailTickWrong").css("display", "inline");
    }
    else if (this.loginForm.controls["email"].valid) {
      this.selectedUser = this.users.filter(a => a.email == this.loginForm.controls["email"].value);
      if (this.selectedUser.length > 0) {
        if (this.selectedUser[0].loggedIn) {
          this.setAlreadyLoginControls();
          $("#emailTickRight").css("display", "none");
          $("#emailTickWrong").css("display", "none");
          localStorage.setItem("notificationCount", "0");
          this.router.navigate(['./alreadyloginalert'], { queryParams: { email: this.loginForm.controls["email"].value, device: this.selectedUser[0].loggedInDevice, id: this.selectedUser[0].id, roleId: this.selectedUser[0].role.id, isAgree: this.selectedUser[0].isAgree } });
        }
        else {
          this.defaultControls();
          $("#emailTickRight").css("display", "inline");
        }
      }
      else if (isManualfil) {
        $("#emailTickRight").css("display", "none");
        $("#emailTickWrong").css("display", "inline");
        $("#emailToolTip").show();
      }
    }
    else {
      $("#emailTickRight").css("display", "none");
      $("#emailTickWrong").css("display", "inline");
    }
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
    this.defaultControls();
    this.clearPasscodes();
    this.loginForm.controls["email"].setValue("");
  }

  setAlreadyLoginControls() {
    $("#txtAlreadyLogin").show();
    $("#emailTickRight").css("display", "none");
    $("#emailTickWrong").css("display", "none");
  }

  defaultControls() {
    $("#emailTickRight").css("display", "none");
    $("#emailTickWrong").css("display", "none");
    $("#txtAlreadyLogin").hide();
  }

  clearPasscodes() {
    this.loginForm.controls["passcode1"].setValue("");
    this.loginForm.controls["passcode2"].setValue("");
    this.loginForm.controls["passcode3"].setValue("");
    this.loginForm.controls["passcode4"].setValue("");
  }

  forgotPassword = function () {
    if (this.loginForm.controls["email"].valid) {
      if (this.selectedUser.length > 0) {
        this.router.navigate(['registeragain'], { queryParams: { id: this.selectedUser[0].id, _rev: this.selectedUser[0]._rev } });
      }
    }
    return false;
  }
  // onAddClick() {
  //   this.openAddDialog();
  // }
  // openAddDialog() {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.autoFocus = true;
  //   dialogConfig.panelClass = "custom-serverurl-popup";
  //   let dialogRef = this.dialog.open(ServerURLComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.shareDataService.serverUrl = result;
  //     this.ngOnInit();
  //   });
  // }  
}