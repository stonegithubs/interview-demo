import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isEthAddressValid } from '../lib/validator';

export function TradeWithdrawRequest(req: Request, res: Response, next: NextFunction): void {
  const { to_address } = req.body;

  if (!to_address || !isEthAddressValid(to_address)) {
    throw new HttpException({ msg: 'Invalid to_address', code: 'SD000030' });
  }

  next();
}
