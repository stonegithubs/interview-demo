import { NextFunction, Request, Response } from 'express';
import HttpException from '../exception/http.exception';
import OwnerWithdrawConfigService from '../service/owner.withdraw.config.service';
import { IUserInfo } from '../lib/types';
import { IOwnerWithdrawConfigCriteria } from '../repository/owner.withdraw.config.repository';

class OwnerWithdrawConfigController {
  private ownerWithdrawConfigService: OwnerWithdrawConfigService;

  constructor() {
    this.ownerWithdrawConfigService = new OwnerWithdrawConfigService();
  }

  newOwnerWithdrawConfig = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const userInfo = req.app.get('userInfo') as IUserInfo;
    const data = req.body as IOwnerWithdrawConfigCriteria;
    data.userId = userInfo.id;
    await this.ownerWithdrawConfigService.insert(data);
    const owcRes = await this.ownerWithdrawConfigService.getOne();

    res.json({
      ok: true,
      ret: owcRes,
    });
    next();
  };

  editOwnerWithdrawConfig = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const userInfo = req.app.get('userInfo') as IUserInfo;
    const data = req.body as IOwnerWithdrawConfigCriteria;
    let owc = await this.ownerWithdrawConfigService.getOne();
    if (!owc) {
      return next(new HttpException({ status: 404, msg: 'owner_withdraw_config not found', code: 'SD000094' }));
    }
    data.userId = userInfo.id;
    owc = await this.ownerWithdrawConfigService.edit(owc, data);
    owc = await this.ownerWithdrawConfigService.getOne();

    res.json({
      ok: true,
      ret: owc,
    });
    next();
  };

  getOwnerWithdrawConfig = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const owc = await this.ownerWithdrawConfigService.getOne();
    if (!owc) {
      return next(new HttpException({ status: 404, msg: 'owner_withdraw_config not found', code: 'SD000089' }));
    }

    res.json({
      ok: true,
      ret: owc,
    });
    next();
  };
}

export default OwnerWithdrawConfigController;
