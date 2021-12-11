import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isPercent } from '../lib/validator';

export function MerchantEditRequest(req: Request, res: Response, next: NextFunction): void {
  const {
    number,
    private_key: privateKey,
    fee_percent: feePercent,
    withdraw_fee_percent: withdrawFeePercent,
  } = req.body;
  if (number && typeof number !== 'string') {
    return next(new HttpException(({ msg: 'Invalid number', code: 'SD000041' })));
  }
  if (feePercent && !isPercent(feePercent)) {
    return next(new HttpException(({ msg: 'Invalid fee_percent', code: 'SD000042' })));
  }
  if (withdrawFeePercent && !isPercent(withdrawFeePercent)) {
    return next(new HttpException(({ msg: 'Invalid withdraw_fee_percent', code: 'SD000043' })));
  }

  next();
}
