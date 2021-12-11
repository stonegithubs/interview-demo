import express, { Application } from 'express';
import http from 'http';
import { IReqWithRawBody } from './types';

export function OverrideRawBody(app: Application): void {
  app.use(express.urlencoded({
    extended: false, verify(req: IReqWithRawBody, res: http.ServerResponse, buf: Buffer, encoding: string): void {
      req.rawBody = buf.toString();
    },
  }));
}
