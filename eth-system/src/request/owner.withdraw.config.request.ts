import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isBoolean } from '../lib/validator';

export async function OwnerWithdrawConfigRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const {
    isEnableFeePercent,
    isEnableFeeAmount,
    feePercent,
    feeAmount,
  } = req.body;
  if (isEnableFeePercent === undefined || !isBoolean(isEnableFeePercent)) {
    return next(new HttpException({ msg: 'Invalid isEnableFeePercent', code: 'SD000090' }));
  }
  if (isEnableFeeAmount === undefined || !isBoolean(isEnableFeeAmount)) {
    return next(new HttpException({ msg: 'Invalid isEnableFeeAmount', code: 'SD000091' }));
  }
  if (!feePercent || isNaN(Number(feePercent))) {
    return next(new HttpException({ msg: 'Invalid feePercent', code: 'SD000092' }));
  }
  if (!feeAmount || isNaN(Number(feeAmount))) {
    return next(new HttpException({ msg: 'Invalid feeAmount', code: 'SD000093' }));
  }
  next();
}
