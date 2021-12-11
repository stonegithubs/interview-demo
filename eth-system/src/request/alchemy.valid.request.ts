import { NextFunction, Request, Response } from 'express';
import { isValidSignature } from '../lib/alchemy';
import HttpException from '../exception/http.exception';
import TelegramQueue from '../queue/telegram.queue';
import config from '../config';

export function AlchemyValidRequest(req: Request, res: Response, next: NextFunction): Response | void {
  // Alchemy 通知有問題
  if (req.body?.error) {
    TelegramQueue.add(TelegramQueue.name, { msg: '[Alchemy Notify]' + req.body.error });
    return next(new HttpException({ status: 200, msg: 'ok', code: 'DD000001' }));
  }

  // 不同鏈的不管
  if (req.body?.network !== config.ETH_NETWORK) {
    return next(new HttpException({ status: 200, msg: 'ok', code: 'DD000002' }));
  }

  const signature = req.headers['x-alchemy-signature'] as string;
  if (!isValidSignature(JSON.stringify(req.body), signature)) {
    return next(new HttpException({ msg: 'Invalid request', code: 'SD000044' }));
  }
  next();
}
