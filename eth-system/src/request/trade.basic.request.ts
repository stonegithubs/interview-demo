import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isValidHttpUrl } from '../lib/validator';

export function TradeBasicRequest(req: Request, res: Response, next: NextFunction): void {
  const { number, sign, currency, amount, cb_url, cb_id } = req.body;
  if (!number) {
    return next(new HttpException({ msg: 'Invalid number', code: 'SD000015' }));
  }
  if (!sign) {
    return next(new HttpException({ msg: 'Invalid sign', code: 'SD000016' }));
  }
  if (!currency) {
    return next(new HttpException({ msg: 'Invalid currency', code: 'SD000017' }));
  }
  if (!amount || isNaN(amount)) {
    return next(new HttpException({ msg: 'Invalid amount', code: 'SD000018' }));
  }
  if (!cb_url || !isValidHttpUrl(cb_url)) {
    return next(new HttpException({ msg: 'Invalid cb_url', code: 'SD000019' }));
  }
  if (!cb_id) {
    return next(new HttpException({ msg: 'Invalid cb_id', code: 'SD000037' }));
  }

  next();
}
