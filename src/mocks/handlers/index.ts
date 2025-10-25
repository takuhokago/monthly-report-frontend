import { authHandlers } from './auth';
import employeeHandlers from './employee';
import { reportHandlers } from './report';

export const handlers = [
  ...authHandlers,
  ...reportHandlers,
  ...employeeHandlers,
];
