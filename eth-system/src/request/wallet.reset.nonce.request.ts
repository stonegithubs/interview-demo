import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';

export function WalletResetNonceRequest(req: Request, res: Response, next: NextFunction): void {
  const { custom_nonce: customNonce } = req.body;
  if (customNonce && (!Number.isInteger(customNonce) || customNonce < 0)) {
    return next(new HttpException({ status: 400, msg: 'Invalid custom_nonce', code: 'SD000050' }));
  }
  next();
}
