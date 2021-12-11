import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import MyRedis from '../lib/my.redis';
import { decodeToken } from '../lib/jwt';
import { HOUR } from '../lib/constant';
import { Role } from '../entity/Role';

export function PageAuthMiddleware(roleName: string) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    // 檢查cookie
    const { eth_system_auth: eth_systemAuth } = req.signedCookies;
    if (!eth_systemAuth) {
      return next(new HttpException({ status: 401, msg: 'Unauthorized', code: 'SD000051' }));
    }
    const redisClient = new MyRedis();
    const token = await redisClient.getKey(eth_systemAuth);
    if (!token) {
      res.clearCookie('eth_system_auth');
      return next(new HttpException({ status: 401, msg: 'Unauthorized', code: 'SD000052' }));
    }

    // 檢查redis內存的cookie token
    const userInfo = decodeToken(token);
    const role = await Role.findOne({ where: { id: userInfo.roleId }, cache: HOUR * 8 });
    if (role.name !== roleName) {
      return next(new HttpException({ status: 401, msg: 'Unauthorized', code: 'SD000097' }));
    }
    next();
  };
}
