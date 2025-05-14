import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
  {
    path: 'employees',
    loadComponent: () =>
      import(
        './features/employees/components/employee-list/employee-list.component'
      ).then((m) => m.EmployeeListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/new',
    loadComponent: () =>
      import(
        './features/employees/components/employee-new/employee-new.component'
      ).then((m) => m.EmployeeNewComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:code',
    loadComponent: () =>
      import(
        './features/employees/components/employee-detail/employee-detail.component'
      ).then((m) => m.EmployeeDetailComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'departments',
    loadComponent: () =>
      import(
        './features/departments/components/department-settings/department-settings.component'
      ).then((m) => m.DepartmentSettingsComponent),
    canActivate: [AuthGuard],
  },
];
