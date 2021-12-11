import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isHashValid } from '../lib/validator';

export function WithdrawEntryManualConfirmRequest(req: Request, res: Response, next: NextFunction): Response | void {
  const { txnHash } = req.body;
  // 如果有帶txn hash表示要取代原有的hash
  if (txnHash && !isHashValid(txnHash)) {
    return next(new HttpException({ msg: 'Invalid txnHash', code: 'SD000079' }));
  }
  next();
}
