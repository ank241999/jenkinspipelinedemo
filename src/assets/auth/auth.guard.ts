import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { IAuth } from '../interfaces/iauth';
import { UserService } from '../services/user.service';
import { ShareDataService } from '../services/share-data.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  iAuth: IAuth;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private shareDataService: ShareDataService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.shareDataService.currentUser != null && this.shareDataService.currentUser != "") {
      this.userService.verifyToken().subscribe(res => {
        this.iAuth = res; 
        if (this.iAuth && this.iAuth.active) {
          if (this.shareDataService.role == "basic" && this.router.url != "/admin/activitymonitoring") {
            this.router.navigate(['/admin/activitymonitoring']);
          }
          else if (this.shareDataService.role == "technicianltd" && !this.router.url.includes("/admin/calibrationservice")) {
            this.router.navigate(['/admin/calibrationservice/fullcalibration']);
          }
          else if (this.shareDataService.role == "techniciancust" && this.router.url != "/admin/calibrationservice/aircalibration") {
            this.router.navigate(['/admin/calibrationservice/aircalibration']);
          }
          return true;
        }
        else {
          // not logged in so redirect to login page with the return url
          console.log("not logged in so redirect to login page with the return url");
          this.logout(state);
          return false;
        }
      },
        err => {
          console.log("Error occurred: " + err.message);
          this.logout(state);
          return false;
        });
    }

    return true;
  }

  logout(state: RouterStateSnapshot) {
    localStorage.clear();
    this.userService.logOutUser().subscribe(res => {
      if (res['status'] == 200) {
        // ActivityConstants.retainRequiredValues();
        this.userService.logoutLog();

        localStorage.removeItem("userLogId");
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      }
      else if (res['status'] == 400) {
        this.userService.logoutLog();

        localStorage.removeItem("userLogId");
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      }
      else if (res['status'] == 500) {
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
    // this.shareDataService.clearSessionVariables();
  }
}