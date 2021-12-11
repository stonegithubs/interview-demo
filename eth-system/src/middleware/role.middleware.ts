import { NextFunction, Request, Response } from 'express';
import { IUserInfo } from '../lib/types';
import HttpException from '../exception/http.exception';
import { Role } from '../entity/Role';

// 先簡易區分角色：使用者User、管理員Admin
export function RoleMiddleware(roleAlias: string) {
  // return a middleware function
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userInfo = req.app.get('userInfo') as IUserInfo;
    const role = await Role.findOne(userInfo.roleId);
    if (!role) {
      return next(new HttpException({ status: 401, msg: 'Unauthorized', code: 'SD000095' }));
    }
    if (role.name !== roleAlias) {
      return next(new HttpException({ status: 401, msg: 'Unauthorized', code: 'SD000096' }));
    }
    next();
  };
}
