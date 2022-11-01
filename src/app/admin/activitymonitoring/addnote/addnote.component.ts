import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../../assets/services/notification.service';
import { MatTable } from '@angular/material';
import { EntranceService } from '../../../../assets/services/entrance.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss']
})
export class AddnoteComponent implements OnInit {
  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  validationMessages = {
    name: [
      { type: '', message: 'This field is required.' },
      { type: 'maxlength', message: 'Max length is 255.' }
    ]
  }

  constructor(private dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) data,
    public formBuilder: FormBuilder, public dialog: MatDialog,
    public entranceservice: EntranceService,
    // private translate: TranslateService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService) {
      translate.setDefaultLang(ActivityConstants.browserLanguage);
      this.translateValidationMessages();
    this.form = formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)]))
    });

    this.form.patchValue({
      name: data
    });
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

    this.spinnerService.hide();
    this.dialogRef.close(this.form.controls["name"].value);
  }

  onScreenClose() {
    //this.dialogRef.close();
    this.onclick();
  }
}
