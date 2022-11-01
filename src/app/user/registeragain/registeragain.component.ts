import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { NotificationService } from '../../../assets/services/notification.service';

var $ = require('jquery');

@Component({
  selector: 'app-registeragain',
  templateUrl: './registeragain.component.html',
  styleUrls: ['./registeragain.component.scss','../styles.css']
})
export class RegisteragainComponent implements OnInit {

  isForgotPassword: boolean = false;
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[]=[];
  users: IUser[] = [];
  id: string="";
  _rev: string="";

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private translate: TranslateService, private notificationService: NotificationService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';    
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this._rev = params["_rev"];
  });
  }  

  navigateRegister(){
    this.userService.deleteUser([parseInt(this.id)]).subscribe(res => {
      if (res['status'] == 200) {          
        this.router.navigate(['register']);
      }
      // else if (res['status'] == 401){
        
      // }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
      });   
  }

  cancel(){
    this.router.navigate(['/']);
  } 
}
