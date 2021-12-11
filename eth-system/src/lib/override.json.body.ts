import express, { Application } from 'express';
import http from 'http';
import { IReqWithRawBody } from './types';

export function OverrideJsonBody(app: Application): void {
  app.use(express.json({
    verify(req: IReqWithRawBody, res: http.ServerResponse, buf: Buffer, encoding: string): void {
      req.rawBody = buf.toString();
    },
  }));
}
