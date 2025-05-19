import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { ReportTableComponent } from '../../../reports/components/report-table/report-table.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, EmployeeEditComponent, ReportTableComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  showForm = false;
}
