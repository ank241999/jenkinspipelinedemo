import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { json } from 'd3';
import { AlertComponent } from '../../shared';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';

export interface Timeout {
  id: number;
  time: string;
}

@Component({
  selector: 'app-threatmanagement',
  templateUrl: './threatmanagement.component.html',
  styleUrls: ['./threatmanagement.component.scss'],
})
export class ThreatmanagementComponent implements OnInit {
  formcontrol: FormControl;
  form: FormGroup;

  timeout: Timeout[] = [
    { id: 1, time: '1 sec/secs' },
    { id: 2, time: '2 sec/secs' },
    { id: 3, time: '3 sec/secs' },
    { id: 3, time: '4 sec/secs' },
    { id: 3, time: '5 sec/secs' }
  ];

  value: number = 3;
  options: Options = {
    floor: 0,
    ceil: 5
  };
  constructor(public formBuilder: FormBuilder,
              private router: Router, private translate: TranslateService ) {
                translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.form = new FormGroup({
      testslider: new FormControl(),
      testdropdown: new FormControl()

    });
  }

  submit() {
    let userObject = {
      Threshold: this.form.controls["testslider"].value,
      Displaytimeout: this.form.controls["testdropdown"].value,
    };
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }
}