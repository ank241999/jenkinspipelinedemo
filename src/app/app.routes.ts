import { Routes } from '@angular/router';
import { Error404PageComponent, Error404PageResolver } from './core';
import { AuthGuard } from '../assets/auth/auth.guard';
import { UserComponent } from './user/user.component';

export const rootRoutes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  // { path: 'devicesetup', loadChildren: () => import('./devicesetup/devicesetup.module').then(m => m.DeviceSetupModule) },
  //{ path: 'accountmanagement', loadChildren: () => import('./accountmanagement/accountmanagement.module').then(m => m.AccountManagementModule) },
  // { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  // { path: 'activitymonitoring', loadChildren: () => import('./activitymonitoring/activitymonitoring.module').then(m => m.ActivityMonitoringModule) },
  { path: 'forms', loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
  { path: 'utils', loadChildren: () => import('./utils/utils.module').then(m => m.UtilsModule) },
  { path: 'layouts', loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule) },
  // {
  //   path: '404',
  //   component: Error404PageComponent,
  //   resolve: { data: Error404PageResolver }
  // },
  //{
    // There's a bug that's preventing wild card routes to be lazy loaded (see: https://github.com/angular/angular/issues/13848)
    // That's why the Error page should be eagerly loaded
    //path: '**',
    //component: Error404PageComponent,
    //resolve: { data: Error404PageResolver }
  //}
];
