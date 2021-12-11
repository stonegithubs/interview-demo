import { NextFunction, Request, Response } from 'express';
import { IEntryCriteria } from '../repository/types';
import WithdrawEntryService from '../service/withdraw.entry.service';
import { getEntryListCriteria } from './shared';
import HttpException from '../exception/http.exception';
import { getManager } from 'typeorm';
import { IUserInfo } from '../lib/types';

class WithdrawEntryController {
  private withdrawEntryService: WithdrawEntryService;

  constructor() {
    this.withdrawEntryService = new WithdrawEntryService();
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const criteria: IEntryCriteria = getEntryListCriteria(req);
    criteria.relations = ['user'];
    const { entries, count } = await this.withdrawEntryService.findAndCountAll(criteria);
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
    const entry = await this.withdrawEntryService.findOneEntry({ id: entryId });
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
    const entry = await this.withdrawEntryService.findOneEntry({ id: entryId });
    if (!entry) {
      return next(new HttpException({ msg: 'No such withdraw_entry', code: 'SD000077' }));
    }
    if (!entry.isProcess) {
      return next(new HttpException({ msg: 'Withdraw_entry is not process', code: 'SD000078' }));
    }
    const userInfo = req.app.get('userInfo') as IUserInfo;
    const entityManager = getManager();
    const result = await entityManager.transaction(async (em) => {
      return await this.withdrawEntryService.manualConfirmEntry(em, entry, userInfo.id, txnHash);
    });
    res.json({
      ok: true,
      ret: result,
    });
    next();
  };

  /**
   * 手動回調
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  manualCallback = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const entryId = req.params.entryId;
    const entry = await this.withdrawEntryService.findOneEntry({ id: entryId });
    if (!entry) {
      return next(new HttpException({ msg: 'No such entry', code: 'SD000080' }));
    }
    if (!entry.isConfirmed) {
      return next(new HttpException({ msg: 'Withdraw_entry is not confirm', code: 'SD000081' }));
    }
    // todo push queue
    res.json({ ok: true });
    next();
  };
}

export default WithdrawEntryController;
