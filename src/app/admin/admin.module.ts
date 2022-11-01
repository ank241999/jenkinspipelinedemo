import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../charts';
import { SharedModule } from '../shared';

// import { TableDataService } from './services/table-data.service';
import { MatTableModule } from '@angular/material/table';

import { AdminComponent } from './admin.component';
import { DashboardResolver } from './admin.resolver';

import { NouisliderModule } from 'ng2-nouislider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// import { RegularTablesResolver, SmartTablesResolver } from './resolvers/tables.resolver';
// import { AddaccountComponent } from './addaccount/addaccount.component';
// import { ModifyaccountComponent } from './modifyaccount/modifyaccount.component';
import { MatButtonModule } from '@angular/material/button'
import { CoreModule } from '../core/core.module';
import { AuthGuard } from '../../assets/auth/auth.guard';
import { TabletComponent } from './tablet/tablet.component';

// { path: 'accountmanagement', loadChildren: () => import('./accountmanagement/accountmanagement.module').then(m => m.AccountManagementModule) },
export const UserRoutes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        //redirectTo: 'dashboard'
        redirectTo: 'accountmanagement'
      },
      {
        path: 'accountmanagement',
        loadChildren: () => import('./accountmanagement/accountmanagement.module').then(m => m.AccountManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'activitymonitoring',
        loadChildren: () => import('./activitymonitoring/activitymonitoring.module').then(m => m.ActivityMonitoringModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'devicesetup',
        loadChildren: () => import('./devicesetup/devicesetup.module').then(m => m.DeviceSetupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.settingsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'location',
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'venuesetup',
        loadChildren: () => import('./venuesetup/venuesetup.module').then(m => m.VenuesetupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'networksetup',
        loadChildren: () => import('./networksetup/networksetup.module').then(m => m.NetworksetupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'networksetup/laneintegration',
        loadChildren: () => import('./networksetup/laneintegration/laneintegration.module').then(m => m.LaneintegrationModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'hexwavetogate',
        loadChildren: () => import('./hexwavetogate/hexwavetogate.module').then(m => m.HexwavetogateModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tablettohexwave',
        loadChildren: () => import('./tablettohexwave/tablettohexwave.module').then(m => m.TablettohexwaveModule),
        canActivate: [AuthGuard]
      },

      {
        path: 'diagnostics',
        loadChildren: () => import('./diagnostics/diagnostics.module').then(m => m.DiagnosticsModule),
        canActivate: [AuthGuard]
      },

      {
        path: 'threatmanagement',
        loadChildren: () => import('./threatmanagement/threatmanagement.module').then(m => m.ThreatManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'securityintegration',
        loadChildren: () => import('./securityintegration/securityintegration.module').then(m => m.SecurityintegrationModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tablet',
        loadChildren: () => import('./tablet/tablet.module').then(m => m.TabletModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'devicemanagement',
        loadChildren: () => import('./devicemanagement/devicemanagement.module').then(m => m.DevicemanagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'statemonitoring',
        loadChildren: () => import('./statemonitoring/statemonitoring.module').then(m => m.StatemonitoringModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'calibrationservice',
        loadChildren: () => import('./calibrationservice/calibrationservice.module').then(m => m.CalibrationserviceModule),
        canActivate: [AuthGuard]
      }
    ]
    // resolve: {
    //   // data: DashboardResolver,
    //   // chart: Ng2ChartsResolver,
    //   // table: ExtendedTablesResolver
    //   //data : Ng2ChartsResolver,
    //   tableData: SmartTablesResolver
    // }
  },
  // {
  //   path: 'addaccount',
  //   component: AddaccountComponent,
  //   // resolve: {
  //   //   data : Ng2ChartsResolver
  //   // }
  // },
  // {
  //   path: 'modifyaccount',
  //   component: ModifyaccountComponent,
  //   // resolve: {
  //   //   data : Ng2ChartsResolver
  //   // }
  // }
];

@NgModule({
  declarations: [
    AdminComponent,
    // AddaccountComponent,
    // ModifyaccountComponent
  ],
  imports: [
    RouterModule.forChild(UserRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    NouisliderModule, MatPaginatorModule, MatSortModule, MatButtonModule, CoreModule
  ],
  // exports: [RouterModule],  
  providers: [
    DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    // TableDataService,
    // RegularTablesResolver,
    // // ExtendedTablesResolver,
    // SmartTablesResolver
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AdminModule { }