import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../../assets/services/notification.service';
import { MatTable } from '@angular/material';
import { EntranceService } from '../../../../assets/services/entrance.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { formatDate } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';

@Component({
  selector: 'app-addgate',
  templateUrl: './addgate.component.html',
  styleUrls: ['./addgate.component.scss']
})
export class AddgateComponent implements OnInit {
  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  validationMessages = {
    name: [
      { type: 'required', message: 'This field is required.' }
    ]
  }

  constructor(private dialogRef: MatDialogRef<MatDialog>,
    public formBuilder: FormBuilder, public dialog: MatDialog,
    public entranceservice: EntranceService,
    // private translate: TranslateService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService) {
      translate.setDefaultLang(ActivityConstants.browserLanguage);
      this.translateValidationMessages();
    this.form = formBuilder.group({
      name: new FormControl('', Validators.required)
    })
  };

  ngOnInit() {
    // this.form = new FormGroup({
    //   name: new FormControl()
    // });
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

  onclick() {
    this.spinnerService.show();
    let gateObject = {
      locationId: 1,
      name: this.form.controls["name"].value
    };

    this.entranceservice.addEntrance(gateObject).subscribe(res => {
      this.spinnerService.hide();
      this.notificationService.showNotification("Gate created successfully", 'top', 'center', '', 'info-circle');

      setTimeout(() => {
        this.onScreenClose();
      }, 3000);
    },
      err => {
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        console.log("Error occurred: " + err.message);
      });
  }

  formatDate = function (date: Date) {
    return this.datepipe.transform(date, 'MM-dd-yyyy hh:mm');
  }

  onScreenClose() {
    this.dialogRef.close();
  }
}
