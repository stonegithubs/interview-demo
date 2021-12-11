import { NextFunction, Request, Response } from 'express';
import { getQRcodeImage } from '../lib/utils';
import MyRedis from '../lib/my.redis';
import HttpException from '../exception/http.exception';
import { Entry } from '../entity/Entry';
import numeral from 'numeral';

class ViewController {
  redisClient: MyRedis;

  constructor() {
    this.redisClient = new MyRedis();
  }

  entryIndex = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { entryId } = req.params;
    if (!(await this.redisClient.isKeyExists(entryId))) {
      return next(new HttpException({ status: 404, msg: 'Page not found', code: 'SD000023' }));
    }
    const entry = await Entry.findOne(entryId, { relations: ['currency'] });
    const addressQrcode = await getQRcodeImage(entry.toAddress);

    res.render('index', {
      currency: entry.currency.name,
      address: entry.toAddress,
      addressQrcode,
      amount: numeral(entry.amount).format('0.00'),
      rate: entry.rate,
      cryptoAmount: numeral(entry.cryptoAmount).format('0.000000'),
    });
  };
}

export default ViewController;
