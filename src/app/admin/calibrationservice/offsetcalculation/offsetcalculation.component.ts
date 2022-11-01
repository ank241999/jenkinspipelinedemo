import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';

@Component({
  selector: 'app-offsetcalculation',
  templateUrl: './offsetcalculation.component.html',
  styleUrls: ['./offsetcalculation.component.scss']
})
export class OffsetcalculationComponent implements OnInit {
  firstFormGroup: FormGroup;
  offsetvalue: number;

  constructor(private router: Router, private _formBuilder: FormBuilder, private notificationService: NotificationService, private spinnerService: Ng4LoadingSpinnerService, private http: HttpClient) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstframe: ['1', Validators.required]
    });
  }

  getoffset() {
    this.spinnerService.show();
    this.http.get<any>("/timing-offset").subscribe(data => {
      this.offsetvalue = data['validated_offset'];
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        this.onScreenClose();
      })
  }

  saveoffset() {
    this.spinnerService.show();
    this.http.get<any>("/save-timing-offset").subscribe(data => {
      this.spinnerService.hide();
      this.notificationService.showNotification("Offset Value Saved Successfully", 'top', 'center', '', 'info-circle');
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        this.onScreenClose();
      })
  }

  checkValue(event) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }

  onScreenClose() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  refresh(): void {
    window.location.reload();
  }

}
