import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';

@Component({
  selector: 'app-securityintegration',
  templateUrl: './securityintegration.component.html',
  styleUrls: ['./securityintegration.component.scss']
})
export class SecurityintegrationComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
   }

  ngOnInit() {
  }

}
