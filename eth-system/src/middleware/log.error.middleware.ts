import { NextFunction } from 'express';
import { IMyRequest } from '../lib/types';
import { IMyResponse } from './types';
import { errorLogger } from '../lib/logger';

export function LogErrorMiddleware(err: Error, req: IMyRequest, res: IMyResponse, next: NextFunction): void {
  let request;
  // 如果是json就parse 不是就用rawBody
  try {
    request = JSON.parse(req.rawBody);
  } catch (e) {
    request = req.rawBody;
  }

  if (typeof request === 'string') {
    request = request.replace(/(?:\r\n|\r|\n|\s|\t)/g, '');
  }

  const resBody = JSON.parse(res.__body_response);
  const { ip, method, originalUrl, uuid } = req;

  errorLogger.error(undefined, { ip, method, originalUrl, uuid, request, response: resBody });
}
