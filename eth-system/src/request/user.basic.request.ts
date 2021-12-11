import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { isValid } from '../lib/validator';

export function UserBasicRequest(req: Request, res: Response, next: NextFunction): void {
  const { username, password } = req.body;
  if (!username || !isValid(username)) {
    return next(new HttpException({ status: 400, msg: 'Invalid username', code: 'SD000001' }));
  }
  if (!password || !isValid(password)) {
    return next(new HttpException({ status: 400, msg: 'Invalid password', code: 'SD000002' }));
  }
  next();
}
