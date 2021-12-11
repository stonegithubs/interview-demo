import express, { Application } from 'express';
import { PageAuthMiddleware } from './middleware/pageAuthMiddleware';

export function EnableDocs(app: Application): void {
  if (process.env.NODE_ENV === 'prod') {
    app.use('/admin/docs', PageAuthMiddleware('Admin'), express.static('dist/docs'));
  } else {
    app.use('/admin/docs', express.static('dist/docs'));
  }
}
