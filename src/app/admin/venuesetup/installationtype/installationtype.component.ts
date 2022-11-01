import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
var $ = require('jquery');

@Component({
  selector: 'app-installationtype',
  templateUrl: './installationtype.component.html',
  styleUrls: ['./installationtype.component.scss']
})
export class InstallationtypeComponent implements OnInit {

  constructor(private location: Location,
    public router: Router,
    private translate: TranslateService,) {
      translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
     }

  ngOnInit() {

    $(function () {
      $(".installtype").click(function () {
        if ($(this).is(":checked")) {
          $("#iddone").show();
          // $("#AddPassport").hide();
        } else {
          $("#dvPassport").hide();
        }
      });
    });
  }

  onBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onSubmit() {
    this.router.navigateByUrl('/admin/hexwavetogate');
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }
}
