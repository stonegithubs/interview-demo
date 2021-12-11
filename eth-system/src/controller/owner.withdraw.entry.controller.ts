import { NextFunction, Request, Response } from 'express';
import { IEntryCriteria } from '../repository/types';
import { getEntryListCriteria } from './shared';
import HttpException from '../exception/http.exception';
import OwnerWithdrawEntryService from '../service/owner.withdraw.entry.service';
import { getManager } from 'typeorm';
import { IUserInfo } from '../lib/types';

class OwnerWithdrawEntryController {
  private ownerWithdrawEntryService: OwnerWithdrawEntryService;

  constructor() {
    this.ownerWithdrawEntryService = new OwnerWithdrawEntryService();
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const criteria: IEntryCriteria = getEntryListCriteria(req);
    criteria.relations = ['currency', 'user'];
    const { entries, count } = await this.ownerWithdrawEntryService.findAndCountAll(criteria);
    const ret = {
      ok: true,
      ret: {
        entries,
        firstResult: criteria.firstResult,
        maxResults: criteria.maxResults,
        total: count,
      },
    };
    res.json(ret);
    next();
  };

  getOne = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const entryId = req.params.entryId;
    const entry = await this.ownerWithdrawEntryService.findOneEntry({ id: entryId });
    if (!entry) {
      return next(new HttpException({ msg: 'No such entry', code: 'SD000071' }));
    }
    const ret = {
      ok: true,
      ret: entry,
    };
    res.json(ret);
    next();
  };

  /**
   * 手動認款
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  manualConfirm = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const entryId = req.params.entryId;
    const { txnHash } = req.body;
    const entry = await this.ownerWithdrawEntryService.findOneEntry({ id: entryId });
    if (!entry) {
      return next(new HttpException({ msg: 'No such withdraw_entry', code: 'SD000077' }));
    }
    if (!entry.isProcess) {
      return next(new HttpException({ msg: 'Withdraw_entry is not process', code: 'SD000078' }));
    }
    const userInfo = req.app.get('userInfo') as IUserInfo;
    const entityManager = getManager();
    const result = await entityManager.transaction(async (em) => {
      return await this.ownerWithdrawEntryService.manualConfirmEntry(em, entry, userInfo.id, txnHash);
    });
    res.json({
      ok: true,
      ret: result,
    });
    next();
  };
}

export default OwnerWithdrawEntryController;
