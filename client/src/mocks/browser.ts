import { setupWorker } from 'msw/browser';
import { httpHandlers } from './handlers/httpHandlers';
// import { wsHandlers } from './handlers/wsHandlers';

export const worker = setupWorker(...httpHandlers);
