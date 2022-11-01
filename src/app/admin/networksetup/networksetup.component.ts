import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';

@Component({
  selector: 'app-networksetup',
  templateUrl: './networksetup.component.html',
  styleUrls: ['./networksetup.component.scss']
})
export class NetworksetupComponent implements OnInit {

  constructor(private router: Router, private translate: TranslateService,
     private location: Location) 
     {
      translate.setDefaultLang(ActivityConstants.browserLanguage);
      document.body.style.background = '#EBEBEB';
     }

  ngOnInit() {
  }

  onSubmit(){
    this.router.navigateByUrl('/admin/networksetup/laneintegration');
  }
  
  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

}
