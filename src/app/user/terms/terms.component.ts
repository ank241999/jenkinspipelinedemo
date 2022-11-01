import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from "@angular/material";
import { UserService } from '../../../assets/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../assets/services/notification.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../assets/services/share-data.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../login/login.component.scss', '../styles.css']
})
export class TermsComponent implements OnInit {
  logoImagePath: string = "/assets/images/Liberty-Defense-Logo-.png";
  form: FormGroup;
  agreement: boolean = false;
  languages = [{ id: "en-US", value: "Default(English)" },
  { id: "fr-FR", value: "French" }];

  constructor(private router: Router, private translate: TranslateService, private notificationService: NotificationService,
    public formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private userService: UserService,
    private shareDataService: ShareDataService) {

    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.form = formBuilder.group({
      language: new FormControl('', Validators.required),
    });

    this.form.patchValue({
      language: "en-US"
    });
  }

  ngOnInit() {

  }

  changeCheck(event) {
    this.agreement = event.checked;
  }

  onclick() {
    //this.router.navigate(['./admin/activitymonitoring']);
    // private String id;
    // private Boolean isAgree;
    // private String languageCode;
    //updateUserAgreement
    //this.onScreenClose();

    let userObject = {
      id: this.shareDataService.id,
      isAgree: this.agreement,
      languageCode: this.form.controls["language"].value
    };

    this.userService.updateUserAgreement(userObject).subscribe(res => {
      if (res['status'] == 201) {
        this.spinnerService.hide();

        setTimeout(() => {
          if (this.shareDataService.role == "basic") {
            this.router.navigate(['./admin/activitymonitoring']);
          }
          else  if (this.shareDataService.role == "advance") {
            this.router.navigate(['./admin/dashboard']);
          }
          else  if (this.shareDataService.role == "technicianltd") {
            //this.router.navigate(['./admin/dashboard']);
            this.router.navigate(['./' + this.shareDataService.moduleName]);
          }
          else  if (this.shareDataService.role == "techniciancust") {
            //this.router.navigate(['./admin/dashboard']);
            this.router.navigate(['./' + this.shareDataService.moduleName]);
          }
        }, 3000);
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

  // onScreenClose() {
  //   let langCode = this.form.controls["language"].value;
  //   this.dialogRef.close(this.agreement.toString() + ":" + langCode);
  // }
}
