import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isEthAddressValid, isHashValid } from '../lib/validator';

export function EntryManualConfirmRequest(req: Request, res: Response, next: NextFunction): Response | void {
  const { txnHash, fromAddress } = req.body;
  if (!txnHash || !isHashValid(txnHash)) {
    return next(new HttpException({ msg: 'Invalid txnHash', code: 'SD000073' }));
  }
  if (!fromAddress || !isEthAddressValid(fromAddress)) {
    return next(new HttpException({ msg: 'Invalid fromAddress', code: 'SD000074' }));
  }
  next();
}
