import { NextFunction } from 'express';
import { resLogger } from '../lib/logger';
import { IMyRequest } from '../lib/types';
import { IMyResponse } from './types';

// 寫log
export function LogMiddleware(req: IMyRequest, res: IMyResponse, next: NextFunction): void {
  let request;
  // 如果是json就parse 不是就用rawBody
  try {
    request = JSON.parse(req.rawBody);
  } catch (e) {
    request = req.rawBody;
  }

  const resBody = JSON.parse(res.__body_response);
  const { ip, method, originalUrl, uuid } = req;

  resLogger.info(undefined, { ip, method, originalUrl, uuid, request, response: resBody });
  next();
}
