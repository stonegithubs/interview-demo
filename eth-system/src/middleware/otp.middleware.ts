import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';

export function OtpMiddleware(req: Request, res: Response, next: NextFunction): void {
  const otp = req?.query?.otp || req?.body?.otp;
  if (!otp || !/^[0-9]{6}$/.test(otp)) {
    return next(new HttpException({ msg: 'Invalid OTP code', code: 'SD000053' }));
  }
  next();
}
