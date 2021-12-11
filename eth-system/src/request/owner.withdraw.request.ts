import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isEthAddressValid } from '../lib/validator';

export async function OwnerWithdrawRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { cryptoAmount, toAddress, currencyId } = req.body;
  if (!cryptoAmount || isNaN(cryptoAmount)) {
    return next(new HttpException({ msg: 'Invalid cryptoAmount', code: 'SD000082' }));
  }
  // todo 有支援多幣別再改寫法
  if (currencyId != 2) {
    return next(new HttpException({ msg: 'Invalid currencyId', code: 'SD000086' }));
  }
  if (!toAddress || !isEthAddressValid(toAddress)) {
    return next(new HttpException({ msg: 'Invalid toAddress', code: 'SD000084' }));
  }
  next();
}
