import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ImgSrcDirective } from '@angular/flex-layout';
var $ = require('jquery');

@Component({
  selector: 'app-guarddetails',
  templateUrl: './guarddetails.component.html',
  styleUrls: ['./guarddetails.component.scss']
})
export class GuarddetailsComponent implements OnInit {

  constructor(private router: Router,
    private dialogRef: MatDialogRef<MatDialog>) { }

  ngOnInit() {
  }

  viewActivity(){
    this.router.navigate(['./admin/activitymonitoring/activitythreats']);
    this.close();
  }

  close(){
    this.dialogRef.close();
  }

  togglePlusMinus(){
    var img1 = "../../../../assets/images/minus_icon.png",
        img2 = "../../../../assets/images/plus_icon.png";
    let imgElement = $("#test");
    let imageSrc = (imgElement.attr("src") === img1)? img2 : img1;
    imgElement.attr("src", imageSrc);
  }
}
