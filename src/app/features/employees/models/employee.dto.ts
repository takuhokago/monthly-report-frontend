export interface EmployeeDto {
  code: string;
  lastName: string;
  firstName: string;
  fullName: string;
  email: string;
  role: string;
  departmentName: string;
}

export type EmployeeRequest = Omit<EmployeeDto, 'fullName'> & {
  password?: string;
};
