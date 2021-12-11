import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import HttpException from '../exception/http.exception';
import MerchantService from '../service/merchant.service';
import { IMerchant } from '../repository/merchant.repository';

class MerchantController {
  private merchantService: MerchantService;

  constructor() {
    this.merchantService = new MerchantService();
  }

  /**
   * @api {get} /merchant/list 商號列表
   * @apiName listMerchant
   * @apiGroup Merchant
   *
   * @apiParam (Query) {Number} id 商號id
   * @apiParam (Query) {String} number 商號
   * @apiParam (Query) {Number} userId 使用者id
   *
   * @apiSuccess {Boolean} ok 是否成功
   * @apiSuccess {Object[]} ret
   * @apiSuccess {Number} ret.id 商號id
   * @apiSuccess {String} ret.number 商號
   * @apiSuccess {Number} ret.userId 使用者id
   * @apiSuccess {String} ret.minPerDeposit 最小入款金額
   * @apiSuccess {String} ret.maxPerDeposit 最大入款金額
   * @apiSuccess {String} ret.minPerWithdraw 最小取款金額
   * @apiSuccess {String} ret.maxPerWithdraw 最大取款金額
   * @apiSuccess {Number} ret.feePercent 入款手續費%
   * @apiSuccess {Number} ret.withdrawFeePercent 取款手續費%
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": [
   *      {
   *        "id": 3,
   *        "number": "43afe907-e8f7-43e2-82ee-be26ea60d048",
   *        "userId": 7,
   *        "minPerDeposit": "33.000000000",
   *        "maxPerDeposit": "30000.000000000",
   *        "minPerWithdraw": "100.000000000",
   *        "maxPerWithdraw": "2500.000000000",
   *        "feePercent": 5,
   *        "withdrawFeePercent": 0
   *      }
   *    ]
   *  }
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id, number, userId, first_result: firstResult = 0, max_results: maxResults = 20 } = req.query;
    const criteria: IMerchant = {
      id: Number(id),
      number: number as string,
      userId: userId as string,
    };
    const merchants = await this.merchantService.findBy(
      criteria,
      firstResult as number,
      maxResults as number,
    );
    res.json({ ok: true, ret: merchants });
    next();
  };

  /**
   * @api {get} /merchant/:merchantId 取得商號
   * @apiName getMerchant
   * @apiGroup Merchant
   *
   * @apiParam (Params) {Number} id 商號id
   *
   * @apiSuccess {Boolean} ok 是否成功
   * @apiSuccess {Object[]} ret
   * @apiSuccess {Number} ret.id 商號id
   * @apiSuccess {String} ret.number 商號
   * @apiSuccess {Number} ret.userId 使用者id
   * @apiSuccess {String} ret.minPerDeposit 最小入款金額
   * @apiSuccess {String} ret.maxPerDeposit 最大入款金額
   * @apiSuccess {String} ret.minPerWithdraw 最小取款金額
   * @apiSuccess {String} ret.maxPerWithdraw 最大取款金額
   * @apiSuccess {Number} ret.feePercent 入款手續費%
   * @apiSuccess {Number} ret.withdrawFeePercent 取款手續費%
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": {
   *      "id": 3,
   *      "number": "43afe907-e8f7-43e2-82ee-be26ea60d048",
   *      "userId": 7,
   *      "minPerDeposit": "33.000000000",
   *      "maxPerDeposit": "30000.000000000",
   *      "minPerWithdraw": "100.000000000",
   *      "maxPerWithdraw": "2500.000000000",
   *      "feePercent": 5,
   *      "withdrawFeePercent": 0
   *      }
   *  }
   */
  getMerchant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { merchantId } = req.params;
    const merchant = await this.merchantService.findOneBy({ id: Number(merchantId) });

    if (!merchant) {
      return next(new HttpException({ msg: 'No such merchant', code: 'SD000059' }));
    }

    res.json({ ok: true, ret: merchant });
    next();
  };

  /**
   * @api {post} /merchant 新增商號
   * @apiName createMerchant
   * @apiGroup Merchant
   *
   * @apiParam {Number} user_id 使用者id
   * @apiParam {Number} min_per_deposit 最小入款金額
   * @apiParam {Number} max_per_deposit 最大入款金額
   * @apiParam {Number} min_per_withdraw 最小取款金額
   * @apiParam {Number} max_per_withdraw 最大取款金額
   * @apiParam {Number} fee_percent 入款手續費%
   * @apiParam {Number} withdraw_fee_percent 取款手續費%
   *
   * @apiSuccess {Boolean} ok 是否成功
   * @apiSuccess {Object} ret
   * @apiSuccess {Number} ret.id 商號id
   * @apiSuccess {String} ret.number 商號
   * @apiSuccess {Number} ret.userId 使用者id
   * @apiSuccess {String} ret.minPerDeposit 最小入款金額
   * @apiSuccess {String} ret.maxPerDeposit 最大入款金額
   * @apiSuccess {String} ret.minPerWithdraw 最小取款金額
   * @apiSuccess {String} ret.maxPerWithdraw 最大取款金額
   * @apiSuccess {Number} ret.feePercent 入款手續費%
   * @apiSuccess {Number} ret.withdrawFeePercent 取款手續費%
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": {
   *      "id": 7,
   *      "number": "c74663af-e03c-4a0f-b627-34aa79d6a90d",
   *      "userId": 7,
   *      "minPerDeposit": "1.000000000",
   *      "maxPerDeposit": "555.000000000",
   *      "minPerWithdraw": "1.000000000",
   *      "maxPerWithdraw": "566.000000000",
   *      "feePercent": 10,
   *      "withdrawFeePercent": 10
   *    }
   *  }
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { user_id } = req.body;
    const u = await User.findOne(user_id);
    if (!u) {
      return next(new HttpException({ msg: 'User not exists', code: 'SD000013' }));
    }

    const body: IMerchant = {
      userId: u.id,
      minPerDeposit: req.body.min_per_deposit,
      maxPerDeposit: req.body.max_per_deposit,
      minPerWithdraw: req.body.min_per_withdraw,
      maxPerWithdraw: req.body.max_per_withdraw,
      feePercent: req.body.fee_percent,
      withdrawFeePercent: req.body.withdraw_fee_percent,
    };

    const merchant = await this.merchantService.create(body);
    const ret = {
      id: merchant.id,
      number: merchant.number,
      user_id: merchant.userId,
      min_per_deposit: merchant.minPerDeposit,
      max_per_deposit: merchant.maxPerDeposit,
      min_per_withdraw: merchant.minPerWithdraw,
      max_per_withdraw: merchant.maxPerWithdraw,
      fee_percent: merchant.feePercent,
      withdraw_fee_percent: merchant.withdrawFeePercent,
    };
    res.json({ ok: true, ret });
    next();
  };

  /**
   * @api {put} /merchant/:merchantId 修改商號
   * @apiName editMerchant
   * @apiGroup Merchant
   *
   * @apiParam (Form) {Number} fee_percent 入款手續費%
   * @apiParam (Form) {Number} withdraw_fee_percent 取款手續費%
   *
   * @apiSuccess {Boolean} ok 是否成功
   * @apiSuccess {Object} ret
   * @apiSuccess {Number} ret.id 商號id
   * @apiSuccess {String} ret.number 商號
   * @apiSuccess {Number} ret.userId 使用者id
   * @apiSuccess {String} ret.minPerDeposit 最小入款金額
   * @apiSuccess {String} ret.maxPerDeposit 最大入款金額
   * @apiSuccess {String} ret.minPerWithdraw 最小取款金額
   * @apiSuccess {String} ret.maxPerWithdraw 最大取款金額
   * @apiSuccess {Number} ret.feePercent 入款手續費%
   * @apiSuccess {Number} ret.withdrawFeePercent 取款手續費%
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": {
   *      "id": 7,
   *      "number": "c74663af-e03c-4a0f-b627-34aa79d6a90d",
   *      "userId": 7,
   *      "minPerDeposit": "1.000000000",
   *      "maxPerDeposit": "555.000000000",
   *      "minPerWithdraw": "1.000000000",
   *      "maxPerWithdraw": "566.000000000",
   *      "feePercent": 10,
   *      "withdrawFeePercent": 10
   *    }
   *  }
   */
  edit = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const merchantId = req.params.merchantId;
    const {
      feePercent,
      withdrawFeePercent,
    } = req.body;

    const m = await this.merchantService.findOneBy({ id: Number(merchantId) });
    if (!m) {
      return next(new HttpException({ status: 404, msg: 'No such merchant', code: 'SD000040' }));
    }

    const result = await this.merchantService.edit(
      m,
      { feePercent, withdrawFeePercent },
    );
    res.json({ ok: true, ret: result });
    next();
  };
}

export default MerchantController;
