import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
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
    path: 'reports/new',
    loadComponent: () =>
      import(
        './features/reports/components/report-new/report-new.component'
      ).then((m) => m.ReportNewComponent),
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
