import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareDataService } from '../../../assets/services/share-data.service';

@Component({
  selector: 'app-intermediate',
  templateUrl: './intermediate.component.html'//,
  //styleUrls: ['./intermediate.component.css']
})
export class IntermediateComponent implements OnInit {

  constructor(private router: Router,
    private shareDataService: ShareDataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let skipLocationChange = params["isskip"];
      if (skipLocationChange != 1) {
        if (localStorage.getItem("userLogId") == undefined) {
          this.router.navigate(['./login']);
        }
        else {
          if (this.shareDataService.role == "basic") {
            this.router.navigate(['./admin/activitymonitoring']);
          }
          else if (this.shareDataService.role == "advance") {
            this.router.navigate(['./admin/dashboard']);
          }
          else if (this.shareDataService.role == "technicianltd") {
            this.router.navigate(['./admin/calibrationservice/fullcalibration']);
          }
          else if (this.shareDataService.role == "techniciancust") {
            this.router.navigate(['./admin/calibrationservice/aircalibration']);
          }
        }
      }
    });
  }
}
