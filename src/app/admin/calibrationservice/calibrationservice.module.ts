import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalibrationserviceComponent } from './calibrationservice.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { AircalibrationComponent } from './aircalibration/aircalibration.component';
import { OffsetcalculationComponent } from './offsetcalculation/offsetcalculation.component';

export const TabletRoutes = [
  {
    path: 'fullcalibration',
    component: CalibrationserviceComponent,
  },
  {
    path: 'aircalibration',
    component: AircalibrationComponent,
  },
  {
    path: 'offsetcalculation',
    component: OffsetcalculationComponent,
  }
];

@NgModule({
  declarations: [CalibrationserviceComponent, AircalibrationComponent, OffsetcalculationComponent],
  imports: [
    RouterModule.forChild(TabletRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CalibrationserviceModule { }
