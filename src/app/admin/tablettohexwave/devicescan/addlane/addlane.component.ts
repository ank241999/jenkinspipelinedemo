import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from "@angular/material";
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../assets/services/notification.service';
import { IEntrance } from '../../../../../assets/interfaces/ientrance';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../../assets/constants/activity-constants';
import { LaneDeviceService } from '../../../../../assets/services/lanedevice.service';
import { ShareDataService } from '../../../../../assets/services/share-data.service';

@Component({
  selector: 'app-addlane',
  templateUrl: './addlane.component.html',
  styleUrls: ['./addlane.component.scss']
})
export class AddlaneComponent implements OnInit {
  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  validationMessages = {
    name: [
      { type: 'required', message: 'This field is required.' }
    ]
  }
  translateValidationMessages() {
    this.translate.get('requiredlanename').subscribe((text: string) => {
      this.validationMessages.name[0].message = text;
    });
  }


  constructor(private dialogRef: MatDialogRef<IEntrance>,
    public formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private laneDeviceService: LaneDeviceService,
    private shareDataService: ShareDataService,
    private translate: TranslateService
  ) {
translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.translateValidationMessages();
      this.translate.get('requiredlanename').subscribe((text: string) => {
        this.validationMessages.name[0].message = text;
      });
    document.body.style.background = '#EBEBEB'
	

    this.form = formBuilder.group({
      name: new FormControl('', Validators.required)
    });
  };

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
    this.onScreenClose(this.form.controls["name"].value);
  }

  onScreenClose(laneId) {
    this.dialogRef.close(laneId);
  }
}
