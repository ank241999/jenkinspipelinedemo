import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants' ;

@Component({
  selector: 'app-laneintegration',
  templateUrl: './laneintegration.component.html',
  styleUrls: ['./laneintegration.component.scss']
})
export class LaneintegrationComponent implements OnInit {

  constructor(private router: Router,
    private translate: TranslateService) { 
      translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
    }

  ngOnInit() {
  }


onDone() {

  this.router.navigateByUrl("/admin/venuesetup");
}

}
