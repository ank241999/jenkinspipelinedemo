import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IDevice } from '../../../../../../assets/interfaces/idevice';

@Component({
  selector: 'app-spathconfigright',
  templateUrl: './spathconfigright.component.html',
  styleUrls: ['./spathconfigright.component.scss']
})
export class SpathconfigrightComponent implements OnInit {

  selectedDevice: IDevice;

  constructor(private location: Location,
    private router: Router) {
  }

  ngOnInit() {
  }

  tryAgain() {
    this.location.back();
  }

  onConfirm() {
    this.router.navigateByUrl('/admin/tablettohexwave/spathleftrightdevice');
  }

}
