import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spathconfigleft',
  templateUrl: './spathconfigleft.component.html',
  styleUrls: ['./spathconfigleft.component.scss']
})
export class SpathconfigleftComponent implements OnInit {

  constructor(private location: Location,
    private router: Router) {
  }

  ngOnInit() {
  }

  tryAgain() {
    this.location.back();
  }

  onConfirm() {
    this.router.navigateByUrl('/admin/tablettohexwave/spathrightdevice');
  }

}
