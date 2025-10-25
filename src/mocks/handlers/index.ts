import { authHandlers } from './auth';
import departmentHandlers from './department';
import employeeHandlers from './employee';
import { reportHandlers } from './report';

export const handlers = [
  ...authHandlers,
  ...reportHandlers,
  ...employeeHandlers,
  ...departmentHandlers,
];
