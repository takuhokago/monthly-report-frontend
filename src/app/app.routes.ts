import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { ReportListComponent } from './features/reports/components/report-list/report-list.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { ReportDetailComponent } from './features/reports/components/report-detail/report-detail.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import(
        './features/reports/components/report-list/report-list.component'
      ).then((m) => m.ReportListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/:id',
    loadComponent: () =>
      import(
        './features/reports/components/report-detail/report-detail.component'
      ).then((m) => m.ReportDetailComponent),
    canActivate: [AuthGuard],
  },
];
