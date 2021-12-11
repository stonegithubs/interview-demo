import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isEthAddressValid } from '../lib/validator';

export function ManualTransferUsdtRequest(req: Request, res: Response, next: NextFunction): Response | void {
  const { amount, to_address: toAddress, custom_nonce: customNonce } = req.body;
  if (!amount || isNaN(amount)) {
    return next(new HttpException({ msg: 'Invalid amount', code: 'SD000047' }));
  }
  if (!toAddress || !isEthAddressValid(toAddress)) {
    return next(new HttpException({ msg: 'Invalid to_address', code: 'SD000048' }));
  }
  if (!customNonce || !Number.isInteger(customNonce) || customNonce < 0) {
    return next(new HttpException({ msg: 'Invalid custom_nonce', code: 'SD000049' }));
  }
  next();
}
