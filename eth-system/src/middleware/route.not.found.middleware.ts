import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';

export function RouteNotFoundMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!res.finished) {
    res.status(404).json({ ok: false, msg: 'Route not found.', code: 404 });
    next(new HttpException({ status: 404, msg: 'Route not found', code: 404 }));
  } else if(res.statusCode !== 200){
    res.status(500).json({ok: false, msg: 'Something wrong', code: 500});
    next(new HttpException({ status: 500, msg: 'Something wrong', code: 500 }));
  } else {
    next();
  }
}
