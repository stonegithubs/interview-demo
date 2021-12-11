import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import CurrencyService from '../service/currency.service';
import dayjs from 'dayjs';
import { isEthAddressValid } from '../lib/validator';

export async function EntryListRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const {
    currencyId,
    createdAtStart,
    createdAtEnd,
    confirmedAtStart,
    confirmedAtEnd,
    completedAtStart,
    completedAtEnd,
    fromAddress,
    toAddress,
    firstResult,
    maxResults,
  } = req.query;
  if (currencyId && !isNaN(Number(currencyId))) {
    const currencyService = new CurrencyService();
    const currency = await currencyService.getCurrency(Number(currencyId));
    if (!currency) {
      return next(new HttpException({ msg: 'Invalid currency', code: 'SD000060' }));
    }
  }
  if (createdAtStart && !dayjs(createdAtStart as string).isValid()) {
    return next(new HttpException({ msg: 'Invalid createdAtStart', code: 'SD000061' }));
  }
  if (createdAtEnd && !dayjs(createdAtEnd as string).isValid()) {
    return next(new HttpException({ msg: 'Invalid createdAtEnd', code: 'SD000062' }));
  }
  if (confirmedAtStart && !dayjs(confirmedAtStart as string).isValid()) {
    return next(new HttpException({ msg: 'Invalid confirmedAtStart', code: 'SD000063' }));
  }
  if (confirmedAtEnd && !dayjs(confirmedAtEnd as string).isValid()) {
    return next(new HttpException({ msg: 'Invalid confirmedAtEnd', code: 'SD000064' }));
  }
  if (completedAtStart && !dayjs(completedAtStart as string).isValid()) {
    return next(new HttpException({ msg: 'Invalid completedAtStart', code: 'SD000065' }));
  }
  if (completedAtEnd && !dayjs(completedAtEnd as string).isValid()) {
    return next(new HttpException({ msg: 'Invalid completedAtEnd', code: 'SD000066' }));
  }
  if (fromAddress && !isEthAddressValid(fromAddress as string)) {
    return next(new HttpException({ msg: 'Invalid fromAddress', code: 'SD000067' }));
  }
  if (toAddress && !isEthAddressValid(toAddress as string)) {
    return next(new HttpException({ msg: 'Invalid toAddress', code: 'SD000068' }));
  }
  if (firstResult && isNaN(Number(firstResult))) {
    return next(new HttpException({ msg: 'Invalid firstResult', code: 'SD000069' }));
  }
  if (maxResults && isNaN(Number(maxResults))) {
    return next(new HttpException({ msg: 'Invalid maxResults', code: 'SD000070' }));
  }

  next();
}
