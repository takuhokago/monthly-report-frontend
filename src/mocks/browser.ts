// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// ここで全ハンドラを登録。main.ts から worker.start(...) される想定。
export const worker = setupWorker(...handlers);
