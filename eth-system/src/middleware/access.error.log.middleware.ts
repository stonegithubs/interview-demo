import { NextFunction, Request, Response } from 'express';
import { accessLogger } from '../lib/logger';
import dayjs from 'dayjs';
import * as util from 'util';

// 寫access log error
// 前面有parse json, parse urlencode可能會丟錯誤
export function AccessErrorLogMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  // 先執行下個function setTimeout等主程序跑完才取得到status code
  next(err);

  setTimeout(() => {
    const { ip, method, originalUrl, httpVersion, headers } = req;
    const log = util.format(
      '%s %s %s %s HTTP/:%s %s content-type:%s user-agent:%s x-alchemy-signature:%s',
      dayjs().toISOString(),
      ip,
      method,
      originalUrl,
      httpVersion,
      res.statusCode,
      headers['content-type'],
      headers['user-agent'],
      headers['x-alchemy-signature'] || 'none',
    );
    accessLogger.info(log);
  });
}
