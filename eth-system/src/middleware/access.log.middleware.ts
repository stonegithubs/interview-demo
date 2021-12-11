import { NextFunction, Response } from 'express';
import { accessLogger } from '../lib/logger';
import { v4 as uuid } from 'uuid';
import { IMyRequest } from '../lib/types';

// 寫access log
export function AccessLogMiddleware(req: IMyRequest, res: Response, next: NextFunction): void {
  const uid = uuid();
  req.uuid = uid;

  // 先執行下個function setTimeout等主程序跑完才取得到status code
  next();
  setTimeout(() => {
    const { ip, method, originalUrl, httpVersion, headers } = req;
    accessLogger.info(undefined, {
      ip,
      method,
      originalUrl,
      httpVersion,
      statusCode: res.statusCode,
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent'],
      'x-alchemy-signature': headers['x-alchemy-signature'] || undefined,
      uid,
    });
  });
}
