import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';

export function ErrorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof HttpException) {
    res.status(err.status).json({ ok: false, msg: err.message, code: err.code });
  } else if (err instanceof SyntaxError) {
    res.status(400).json({ ok: false, msg: 'Invalid request format', code: 0 });
  } else {
    res.status(500).json({ ok: false, msg: err.message, code: 0 });
  }
  next(err);
}
