import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ITablet } from '../../../../assets/interfaces/itablet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TabletService } from '../../../../assets/services/tablet.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IUser } from '../../../../assets/interfaces/iuser';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../../../../assets/services/user.service';

var $ = require('jquery');

@Component({
  selector: 'app-edittablet',
  templateUrl: './edittablet.component.html',
  styleUrls: ['./edittablet.component.scss', '../../../user/styles.css']
})
export class EdittabletComponent implements OnInit {

  tablet: ITablet = {};
  primaryTab: boolean = false;
  form: FormGroup;
  isPaste: boolean = false;
  users: IUser[] = [];
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[] = [];

  // Form validation messages
  validationMessages = {
    tabletName: [
      { type: 'required', message: 'Tablet Name is required.' }
    ],
    tabletMacAddress: [
      { type: 'required', message: 'Mac Address is required.' }
    ],
    tabletStatus: [
      { type: 'required', message: 'Status is required.' }
    ]
  }

  tabletStatus = [{ "id": false, "status": "OFF" },
  { "id": true, "status": "ON" }];

  constructor(public formBuilder: FormBuilder,
    private tabletService: TabletService,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private shareDataService: ShareDataService,
    private spinnerService: Ng4LoadingSpinnerService,
    private notificationService: NotificationService,
    private translate: TranslateService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.form = formBuilder.group({
      tabletName: new FormControl('', Validators.required),
      tabletMacAddress: new FormControl('', Validators.required),
      tabletStatus: new FormControl('', Validators.required),
      primaryTablet: new FormControl('', Validators.required)
    })

    this.tablet = shareDataService.getSharedData();

    this.form.patchValue({
      tabletName: this.tablet.tabletName,
      tabletMacAddress: this.tablet.tabletMacAddress,
      tabletStatus: this.tablet.tabletStatus,
      primaryTablet: this.tablet.primaryTablet
    })
  }

  ngOnInit() {
    this.form.controls["tabletMacAddress"].valueChanges
      .subscribe(
        email => {
          if (this.isPaste == false) {
            $(".autocomplete_container").show();
          }
        });

    this.filteredOptions = this.form.controls["tabletMacAddress"].valueChanges
      .pipe(
        startWith(''),
        //map(value => this.emailFilter(value)) 
        map(val => val.length >= 1 && val != "" ? this.emailFilter(val) : [])
      );
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

  emailFilter(value: string): IUser[] {
    const filterValue = (value == undefined ? "" : value.toLowerCase());
    this.userService.getUsers(filterValue).subscribe(res => {
      this.users = res["data"];
    },
      err => {
        console.log("Error occurred: " + err.message);
      });

    return (filterValue == "" ? [] : (this.users.length > 0 ? this.users.filter(a => a.email.toLowerCase().includes(filterValue) && a.role.replace("[", "").replace("]", "") == "BASIC") : []));//.slice(0,4);
  }

  onSubmit() {
    let tabletObject = {
      id: this.tablet.id,
      tabletName: this.form.controls['tabletName'].value,
      tabletMacAddress: this.form.controls['tabletMacAddress'].value,
      tabletStatus: this.form.controls['tabletStatus'].value,
      primaryTablet: this.form.controls['primaryTablet'].value
    }
    this.tabletService.updateTablet(tabletObject).subscribe(res => {
      if (res['status'] == 200) {
        this.spinnerService.hide();
        let response: ITablet = res["data"];

        // this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
        this.notificationService.showNotification("Tablet Updated successfully", 'top', 'center', '', 'info-circle');
        setTimeout(() => {
        this.onScreenBack();
        }, 3000);
        // });
      }

      else if (res['status'] == 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        setTimeout(() => {
        this.onScreenBack();
        }, 3000);
      }
      else if (res['status'] == 400 && res['error'].includes("ConstraintViolationException")) {
        this.spinnerService.hide();
        this.notificationService.showNotification("Tablet Mac Address is already aquired.", 'top', 'center', 'danger', 'info-circle');
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
      })

  }
  
  // fillIP() {
  //   this.form.controls['tabletMacAddress'].setValue(sessionStorage.getItem('LOCAL_IP'));
  // }

  primaryTablet($event) {
    this.primaryTab = $event.checked;
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
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
        root.form.controls['tabletMacAddress'].setValue(pastedText);
      }
    }, delay);
  }

  autofill(val: any) {
    this.form.controls['tabletMacAddress'].setValue(val);
    $(".autocomplete_container").hide();
  }

}
