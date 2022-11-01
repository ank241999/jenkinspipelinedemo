import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from "@angular/material";
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IGenetec } from '../../../../assets/interfaces/igenetec';
import { GenetecConfigurationService } from '../../../../assets/services/genetec-configuration.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';

@Component({
  selector: 'app-genetecsettings',
  templateUrl: './genetecsettings.component.html',
  styleUrls: ['./genetecsettings.component.scss']
})
export class GenetecsettingsComponent implements OnInit {
  filteredData: IGenetec;
  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  validationMessages = {
    url: [
      { type: 'required', message: 'This field is required.' }
    ],
    securityKey: [
      { type: 'required', message: 'This field is required.' }
    ],
    userName: [
      { type: 'required', message: 'This field is required.' }
    ],
    password: [
      { type: 'required', message: 'This field is required.' }
    ],
    cardHolderId: [
      { type: 'required', message: 'This field is required.' }
    ]
  }
  translateValidationMessages() {
    this.translate.get('requiredlanename').subscribe((text: string) => {
      this.validationMessages.url[0].message = text;
      this.validationMessages.securityKey[0].message = text;
      this.validationMessages.userName[0].message = text;
      this.validationMessages.password[0].message = text;
    });
  }

  constructor(private dialogRef: MatDialogRef<IGenetec>,
    public formBuilder: FormBuilder,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private notificationService: NotificationService,
    private shareDataService: ShareDataService,
    private genetecService: GenetecConfigurationService,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.translateValidationMessages();
    this.translate.get('requiredlanename').subscribe((text: string) => {
      this.validationMessages.url[0].message = text;
      this.validationMessages.securityKey[0].message = text;
      this.validationMessages.userName[0].message = text;
      this.validationMessages.password[0].message = text;
    });
    document.body.style.background = '#EBEBEB'


    this.form = formBuilder.group({
      url: new FormControl('', Validators.required),
      securityKey: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      cardHolderId: new FormControl('', Validators.required),
      on: new FormControl('')
    });
  };

  ngOnInit() {
    this.spinnerService.show();

    this.genetecService.getAllVenueGenetec().subscribe(res => {
      if (res['status'] == 200) {
        this.filteredData = res["data"].filter(a => a.locationId == 1)[0];
        if (this.filteredData != null) {
          this.form.patchValue({
            url: this.filteredData.url,
            securityKey: this.filteredData.securityKey,
            userName: this.filteredData.userName,
            password: this.filteredData.password,
            cardHolderId: this.filteredData.cardHolderId,
            on: this.filteredData.on
          })
        }
        this.spinnerService.hide();
      }

      else if (res['status'] == 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        this.onScreenClose();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
            this.onScreenClose();
          });
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
          this.onScreenClose();
        }
      })
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
    // this.onScreenClose(this.form.controls["name"].value);
    this.spinnerService.show();

    if (this.filteredData == null) {

      let genetecObject: IGenetec = {
        url: this.form.controls['url'].value,
        securityKey: this.form.controls['securityKey'].value,
        userName: this.form.controls['userName'].value,
        password: this.form.controls['password'].value,
        cardHolderId: this.form.controls['cardHolderId'].value,
        on: this.form.controls['on'].value,
        locationId: 1
      }

      this.addGenetec(genetecObject);
    }
    else {

      let genetecObject: IGenetec = {
        id: this.filteredData.id,
        url: this.form.controls['url'].value,
        securityKey: this.form.controls['securityKey'].value,
        userName: this.form.controls['userName'].value,
        password: this.form.controls['password'].value,
        cardHolderId: this.form.controls['cardHolderId'].value,
        on: this.form.controls['on'].value,
        locationId: this.filteredData.locationId
      }

      this.editGenetec(genetecObject);
    }
  }

  onScreenClose() {
    this.dialogRef.close();
  }

  addGenetec(genetecObject) {
    this.genetecService.addGenetecSettings(genetecObject).subscribe(res => {
      if (res['status'] == 201) {
        this.spinnerService.hide();

        this.notificationService.showNotification("Genetec configure successfully", 'top', 'center', '', 'info-circle');
        this.onScreenClose();
      }

      else if (res['status'] == 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        this.onScreenClose();
      }

      setTimeout(() => {
        this.onScreenClose();
      }, 3000);
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
            this.onScreenClose();
          });
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
          this.onScreenClose();
        }
      })
  }

  editGenetec(genetecObject) {
    this.genetecService.putGenetecSettings(genetecObject).subscribe(res => {
      if (res['status'] == 201) {
        this.spinnerService.hide();

        this.notificationService.showNotification("Genetec configure successfully", 'top', 'center', '', 'info-circle');
        this.onScreenClose();
      }

      else if (res['status'] == 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        this.onScreenClose();
      }

      setTimeout(() => {
        this.onScreenClose();
      }, 3000);
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();

        if (err["status"] == 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
            this.onScreenClose();
          });
        }
        else {
          this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
          this.onScreenClose();
        }
      })
  }
}
