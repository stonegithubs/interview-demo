import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import { decodeToken } from '../lib/jwt';

export function AuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.header('Authorization')) {
    return next(new HttpException({ status: 401, msg: 'Unauthorized', code: 'SD000039' }));
  }

  let authorization = req.headers.authorization;
  if (authorization.includes('Bearer ')) {
    authorization = authorization.replace('Bearer ','');
  }
  const token = decodeToken(authorization);
  req.app.set('userInfo', token);
  next();
}
