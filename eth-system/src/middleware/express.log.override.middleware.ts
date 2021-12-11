import { NextFunction, Request } from 'express';
import { IMyResponse } from './types';

// 改寫express morgan log
export function ExpressLogOverrideMiddleware(req: Request, res: IMyResponse, next: NextFunction): void {
  const originalSend = res.send;
  // @ts-ignore
  res.send = function (body) { // res.send() 和 res.json() 都會攔截到
    res.__body_response = body;
    originalSend.call(this, body);
  };
  next();
}
