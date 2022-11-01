import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatemonitoringComponent } from './statemonitoring.component';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export const TabletRoutes = [
  {
    path: '',
    component: StatemonitoringComponent,
  }
];

@NgModule({
  declarations: [StatemonitoringComponent],
  imports: [
    RouterModule.forChild(TabletRoutes),
    CommonModule,
    MatExpansionModule,
    MatSlideToggleModule
  ]
})
export class StatemonitoringModule { }
