import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from '../../../../assets/services/notification.service';
import { StatemonitoringService } from '../../../../assets/services/statemonitoring.service';

@Component({
  selector: 'app-reboot',
  templateUrl: './reboot.component.html',
  styleUrls: ['./reboot.component.scss']
})
export class RebootComponent implements OnInit {
  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<any>, private notificationService: NotificationService, public formBuilder: FormBuilder, private statemonitoringservice: StatemonitoringService) {
    this.form = formBuilder.group({
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.statemonitoringservice.rebootService(this.form.controls["password"].value).subscribe(res => {
      console.log(res);
      this.notificationService.showNotification('Device will actually be rebooted', 'top', 'center', 'warning', 'info-circle');
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.notificationService.showNotification("Error occurred: " + err['error']['reason'], 'top', 'center', 'danger', 'info-circle')
      });
    this.onScreenClose();
  }

  onScreenClose() {
    this.dialogRef.close();
  }

}
