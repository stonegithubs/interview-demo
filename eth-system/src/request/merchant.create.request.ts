import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';

export function MerchantCreateRequest(req: Request, res: Response, next: NextFunction): HttpException {
  const {
    user_id,
    min_per_deposit,
    max_per_deposit,
    min_per_withdraw,
    max_per_withdraw,
    fee_percent,
    withdraw_fee_percent,
  } = req.body;
  if (!user_id || isNaN(user_id)) {
    return new HttpException({ msg: 'Invalid user_id', code: 'SD000008' });
  }
  if (!min_per_deposit || isNaN(min_per_deposit) || min_per_deposit <= 0) {
    return new HttpException({ msg: 'Invalid min_per_deposit', code: 'SD000009' });
  }

  if (!max_per_deposit || isNaN(max_per_deposit) || max_per_deposit <= 0) {
    return new HttpException({ msg: 'Invalid max_per_deposit', code: 'SD000010' });
  }

  if (!min_per_withdraw || isNaN(min_per_withdraw) || min_per_withdraw <= 0) {
    return new HttpException({ msg: 'Invalid min_per_withdraw', code: 'SD000011' });
  }

  if (!max_per_withdraw || isNaN(max_per_withdraw) || max_per_withdraw <= 0) {
    return new HttpException({ msg: 'Invalid max_per_withdraw', code: 'SD000012' });
  }

  if (!fee_percent || isNaN(fee_percent) || fee_percent < 0 || fee_percent > 100) {
    return new HttpException({ msg: 'Invalid fee_percent', code: 'SD000013' });
  }

  if (!withdraw_fee_percent || isNaN(withdraw_fee_percent) || withdraw_fee_percent < 0 || withdraw_fee_percent > 100) {
    return new HttpException({ msg: 'Invalid withdraw_fee_percent', code: 'SD000058' });
  }
  next();
}
