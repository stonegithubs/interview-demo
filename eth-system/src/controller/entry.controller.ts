import { NextFunction, Request, Response } from 'express';
import EntryService from '../service/entry.service';
import { IEntryCriteria } from '../repository/types';
import { getEntryListCriteria } from './shared';
import HttpException from '../exception/http.exception';
import { IUserInfo } from '../lib/types';

class EntryController {
  private entryService: EntryService;

  constructor() {
    this.entryService = new EntryService();
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const criteria: IEntryCriteria = getEntryListCriteria(req);
    criteria.relations = ['user'];
    const { entries, count } = await this.entryService.findAndCountAll(criteria);
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
    const entry = await this.entryService.findOneEntry({ id: entryId });
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
    const { txnHash, fromAddress } = req.body;
    const entry = await this.entryService.findOneEntry({ id: entryId });
    if (!entry) {
      return next(new HttpException({ msg: 'No such entry', code: 'SD000072' }));
    }
    if (!entry.isProcess) {
      return next(new HttpException({ msg: 'Entry is not process', code: 'SD000072' }));
    }
    const userInfo = req.app.get('userInfo') as IUserInfo;
    const result = await this.entryService.manualConfirmEntry({
      entry,
      txnHash,
      fromAddress,
      userId: userInfo.id,
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
    const entry = await this.entryService.findOneEntry({ id: entryId });
    if (!entry) {
      return next(new HttpException({ msg: 'No such entry', code: 'SD000075' }));
    }
    if (!entry.isConfirmed) {
      return next(new HttpException({ msg: 'Entry is not confirm', code: 'SD000076' }));
    }
    // todo push to queue
    res.json({ ok: true });
    next();
  };
}

export default EntryController;
