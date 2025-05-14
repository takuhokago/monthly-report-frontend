// src/app/features/employees/models/employee.dto.ts

export interface EmployeeDto {
  code: string;
  lastName: string;
  firstName: string;
  fullName: string;
  email: string;
  role: string;
  departmentName: string;
}

// src/app/features/employees/models/employee.dto.ts

export interface EmployeeDto {
  code: string;
  lastName: string;
  firstName: string;
  fullName: string;
  email: string;
  role: string;
  departmentName: string;
}

export type EmployeeCreateRequest = Omit<EmployeeDto, 'fullName'>;
