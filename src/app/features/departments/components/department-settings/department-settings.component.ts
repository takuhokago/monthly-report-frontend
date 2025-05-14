import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { DepartmentDto } from '../../models/department.dto';

@Component({
  selector: 'app-department-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-settings.component.html',
})
export class DepartmentSettingsComponent implements OnInit {
  departments: DepartmentDto[] = [];
  newDepartmentName = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // 所属一覧取得
  loadDepartments(): void {
    this.departmentService.getAll().subscribe((data) => {
      this.departments = data;
    });
  }

  // 所属追加
  addDepartment(): void {
    const trimmedName = this.newDepartmentName.trim();
    if (!trimmedName) return;

    this.departmentService
      .create({ name: trimmedName })
      .subscribe((created) => {
        this.departments.push(created);
        this.newDepartmentName = '';
      });
  }

  // 所属削除
  deleteDepartment(id: number): void {
    this.departmentService.delete(id).subscribe(() => {
      this.departments = this.departments.filter((d) => d.id !== id);
    });
  }
}
