import { NextFunction, Request, Response } from 'express';
import Ethereum from '../lib/web3';
import HttpException from '../exception/http.exception';
import { Currency } from '../entity/Currency';
import { Merchant } from '../entity/Merchant';
import EntryService from '../service/entry.service';
import MyRedis from '../lib/my.redis';
import config from '../config';
import MerchantService from '../service/merchant.service';
import { getCustomRepository, getManager } from 'typeorm';
import ContractCurrencyService from '../service/contract.currency.service';
import Web3Service, { ITransferUSDTData } from '../service/web3.service';
import WithdrawEntryService from '../service/withdraw.entry.service';
import { Contract } from '../entity/Contract';
import numeral from 'numeral';
import RateRepository from '../repository/rate.repository';
import { ContractCurrency } from '../entity/ContractCurrency';
import { objToMd5Sign } from '../lib/utils';
import { HOUR } from '../lib/constant';
import OwnerWithdrawEntryService from '../service/owner.withdraw.entry.service';
import OwnerWithdrawConfigService from '../service/owner.withdraw.config.service';

class TradeController {
  private ethereum: Ethereum;
  private redisClient: MyRedis;
  private entryService: EntryService;
  private withdrawEntryService: WithdrawEntryService;
  private merchantService: MerchantService;
  private contractCurrencyService: ContractCurrencyService;
  private web3Service: Web3Service;
  private ownerWithdrawService: OwnerWithdrawEntryService;
  private ownerWithdrawConfigService: OwnerWithdrawConfigService;

  constructor() {
    this.ethereum = new Ethereum();
    this.redisClient = new MyRedis();
    this.entryService = new EntryService();
    this.withdrawEntryService = new WithdrawEntryService();
    this.merchantService = new MerchantService();
    this.contractCurrencyService = new ContractCurrencyService();
    this.web3Service = new Web3Service();
    this.ownerWithdrawService = new OwnerWithdrawEntryService();
    this.ownerWithdrawConfigService = new OwnerWithdrawConfigService();
  }

  /**
   * @api {post} /trade/deposit ??????
   * @apiName Deposit
   * @apiGroup Trade
   *
   * @apiParam {String} number ??????
   * @apiParam {String="USDT(ERC20)"} currency ??????
   * @apiParam {Number} amount ??????(?????????)
   * @apiParam {String} cb_url ????????????
   * @apiParam {String} cb_id
   * @apiParam {String} sign ??????
   * @apiParamExample ?????? ?????????form?????????
   *  {
   *    "number": "43afe907-e8f7-43e2-82ee-be26ea60d048",
   *    "currency": "USDT(ERC20)",
   *    "amount": "5000",
   *    "cb_url": "http://1234",
   *    "cb_id": 20200101010001
   *    "sign": "a7fc5d533c5021924a4fafb5c18b0be3",
   *  }
   *
   * @apiSuccess {Boolean} ok ????????????
   * @apiSuccess {Object} ret ????????????
   * @apiSuccess {String} ret.deposit_url ??????????????????
   * @apiSuccess {String} ret.rate ??????
   * @apiSuccess {String} ret.crypto_amount ??????????????????
   * @apiSuccess {String} ret.fee ?????????????????????
   * @apiSuccess {String} ret.currency ???????????????
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": {
   *      "deposit_url": "http://localhost:5000/entry/348495548214367232",
   *      "rate": "0.154083",
   *      "crypto_amount": "189.595107",
   *      "fee": "18.959511",
   *      "currency": "USDT(ERC20)"
   *    }
   *  }
   */
  deposit = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { number, sign, currency, amount, cb_url: cbUrl, cb_id: cbId } = req.body;
    const currencies = await Currency.find();
    const currencyEntity = currencies.find(c => c.name === currency);
    if (!currencyEntity) {
      return next(new HttpException({ msg: 'This currency is not supported', code: 'SD000020' }));
    }
    const merchant = await Merchant.findOne({
      where: { number },
      select: ['id', 'number', 'privateKey', 'feePercent'],
    });
    if (!merchant) {
      return next(new HttpException({ msg: 'Wrong number or private_key', code: 'SD000031' }));
    }

    const { sign: _, ...params } = req.body;
    const md5check = objToMd5Sign({ ...params, key: merchant.privateKey });
    // ????????????
    if (md5check !== sign) {
      return next(new HttpException({ msg: 'Wrong sign', code: 'SD000056' }));
    }

    if (Number(amount) < Number(merchant.minPerDeposit) || Number(amount) > Number(merchant.maxPerDeposit)) {
      return next(new HttpException({ msg: 'Invalid amount', code: 'SD000022' }));
    }
    try {
      const args = {
        merchant,
        currency: currencyEntity,
        amount,
        cbUrl,
        cbId,
      };
      const entry = await this.entryService.deposit(args);
      await this.redisClient.setKeyWithEx(entry.id, entry.id, 3600);
      res.json({
        ok: true,
        ret: {
          deposit_url: config.WEB_URL + entry.id,
          rate: entry.rate,
          crypto_amount: entry.cryptoAmount,
          fee: entry.fee,
          currency: currencyEntity.name,
        },
      });
      next();
    } catch (e) {
      return next(e);
    }
  };

  /**
   * @api {post} /trade/withdraw ??????
   * @apiName Withdraw
   * @apiGroup Trade
   *
   * @apiParam {String} number ??????
   * @apiParam {String="USDT(ERC20)"} currency ??????
   * @apiParam {Number} amount ??????(?????????)
   * @apiParam {String} cb_url ????????????
   * @apiParam {String} cb_id
   * @apiParam {String} to_address ??????????????????
   * @apiParam {String} sign ??????
   *
   * @apiSuccess {Boolean} ok ????????????
   * @apiSuccessExample Success
   *  {
   *    "ok": true
   *  }
   */
  withdraw = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { number, sign, currency, amount, cb_url: cbUrl, to_address: toAddress, cb_id: cbId } = req.body;
    const currencyEntity = await this.getCurrency(currency);
    const merchant = await Merchant.findOne({
      where: { number },
      select: [
        'id',
        'number',
        'privateKey',
        'minPerWithdraw',
        'maxPerWithdraw',
      ],
    });
    if (!merchant) {
      return next(new HttpException({
        status: 404,
        msg: 'Wrong number or private_key',
        code: 'SD000032',
      }));
    }

    const { sign: _, ...params } = req.body;
    const md5check = objToMd5Sign({ ...params, key: merchant.privateKey });
    // ????????????
    if (md5check !== sign) {
      return next(new HttpException({ msg: 'Wrong sign', code: 'SD000057' }));
    }

    if (Number(amount) < Number(merchant.minPerWithdraw) || Number(amount) > Number(merchant.maxPerWithdraw)) {
      return next(new HttpException({ msg: 'Invalid amount', code: 'SD000033' }));
    }

    const rateRepository = getCustomRepository(RateRepository);
    const rate = await rateRepository.getLatestOne(currency.name);

    const contract = await Contract.findOne({ where: { merchantId: merchant.id } });
    const contractCurrency = await ContractCurrency.findOne({ where: { contractAddress: contract.address } });
    const cryptoAmount = numeral(amount).multiply(numeral(rate.rate).value()).format('0.000000');
    const fee = numeral(numeral(cryptoAmount).value() * merchant.withdrawFeePercent / 100.0).format('0.000000');
    const realCryptoAmount = numeral(cryptoAmount).subtract(numeral(fee).value()).format('0.000000');

    // ???????????????????????????
    if (numeral(contractCurrency.balance).value() < numeral(cryptoAmount).value()) {
      return next(new HttpException({ msg: 'Over than amount', code: 'SD000055' }));
    }

    const entityManager = getManager();
    try {
      // ???????????????
      const data: ITransferUSDTData = {
        fromAddress: contract.address,
        toAddress: toAddress,
        amount: realCryptoAmount,
      };
      const {
        txnHash,
        gasPrice,
        signedTransaction,
        rawData,
        walletAddress,
      } = await this.web3Service.getTransferUSDTData(data);

      // ?????????db
      await entityManager.transaction(async (em) => {
        const withdrawArgs = {
          merchant,
          toAddress,
          amount,
          currency: currencyEntity,
          cbUrl,
          cbId,
          txnHash,
          gasPrice,
          cryptoAmount,
          realCryptoAmount,
          fee,
          rate: rate.rate,
        };
        const withdrawEntry = await this.withdrawEntryService.withdraw(em, withdrawArgs);
        await this.contractCurrencyService.decreaseWithWithdraw(em, withdrawEntry);
      });

      // ??????db??????????????? ????????????queue
      await this.web3Service.pushToTradeQueue({
        txnHash,
        signedTransaction,
        rawData,
        walletAddress,
      });

      return res.json({ ok: true });
    } catch (err) {
      return next(new HttpException({ msg: err.message, code: 'SD000036' }));
    }
  };

  /**
   * @api {post} /trade/manual_transfer_usdt ????????????usdt(????????????)
   * @apiName manual_transfer_usdt
   * @apiDescription ????????????gas price??????????????????
   * @apiGroup Trade
   *
   * @apiParam {Number} amount ??????(?????????)
   * @apiParam {String} to_address ??????????????????
   * @apiParam {Number} custom_nonce ??????nonce
   * @apiParam {Number} [gas_price] ??????gas_price
   *
   * @apiSuccess {Boolean} ok ????????????
   * @apiSuccessExample Success
   *  {
   *    "ok": true
   *  }
   */
  manualTransferUSDT = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { amount, to_address: toAddress, custom_nonce: customNonce, gas_price: gasPrice } = req.body;
    const merchant = await Merchant.findOne();
    const contract = await Contract.findOne();
    const rateRepository = getCustomRepository(RateRepository);
    const rate = await rateRepository.getLatestOne('USDT(ERC20)');

    const cryptoAmount = numeral(amount).multiply(numeral(rate.rate).value()).format('0.000000');
    const fee = numeral(numeral(cryptoAmount).value() * merchant.feePercent / 100.0).format('0.000000');
    const realWithdrawAmount = numeral(cryptoAmount).subtract(numeral(fee).value()).format('0.000000');

    // ???????????????
    const data: ITransferUSDTData = {
      fromAddress: contract.address,
      toAddress: toAddress,
      amount: realWithdrawAmount,
      nonce: customNonce,
      gasPrice,
    };
    try {
      const {
        txnHash,
        signedTransaction,
        rawData,
        walletAddress,
        gasPrice,
      } = await this.web3Service.getTransferUSDTData(data);
      res.json({ ok: true, ret: txnHash });
      next();
    } catch (err) {
      return next(err);
    }
  };

  /**
   * @api {post} /trade/owner_withdraw
   * @apiName owner_withdraw
   * @apiGroup Trade
   *
   * @apiParam {Number} cryptoAmount ??????
   * @apiParam {String} currency ??????
   * @apiParam {String} toAddress ??????????????????
   *
   * @apiSuccess {Boolean} ok ????????????
   * @apiSuccessExample Success
   *  {
   *    "ok": true
   *  }
   */
  ownerWithdraw = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    let { cryptoAmount } = req.body;
    const { toAddress, currencyId } = req.body;
    const currencyEntity = await Currency.findOne(currencyId);
    const merchant = await Merchant.findOne();
    const contract = await Contract.findOne({ where: { merchantId: merchant.id }, cache: 12 * HOUR });
    const contractCurrency = await ContractCurrency.findOne({
      where: { contractAddress: contract.address },
      relations: ['currency'],
      cache: 12 * HOUR,
    });

    cryptoAmount = numeral(cryptoAmount);

    if (cryptoAmount > numeral(contractCurrency.balance).value()) {
      return next(new HttpException({ msg: 'Balance not enough', code: 'SD000087' }));
    }

    const owc = await this.ownerWithdrawConfigService.getOne(contractCurrency.currencyId);
    const fee = this.ownerWithdrawConfigService.getFee(owc, cryptoAmount.value());
    const realCryptoAmount = numeral(cryptoAmount.value()).subtract(numeral(fee).value()).format('0.000000');

    try {
      // ???????????????
      const data: ITransferUSDTData = {
        fromAddress: contract.address,
        toAddress: toAddress,
        amount: realCryptoAmount,
      };
      const {
        txnHash,
        gasPrice,
        signedTransaction,
        rawData,
        walletAddress,
      } = await this.web3Service.getTransferUSDTData(data);
      const entityManager = getManager();

      // ?????????db
      await entityManager.transaction(async (em) => {
        const withdrawArgs = {
          merchant,
          toAddress,
          currency: currencyEntity,
          txnHash,
          gasPrice,
          cryptoAmount: cryptoAmount.format('0.000000') as string,
          realCryptoAmount: realCryptoAmount as string,
          fee: numeral(fee).format('0.000000'),
        };
        const withdrawEntry = await this.ownerWithdrawService.ownerWithdraw(em, withdrawArgs);
        await this.contractCurrencyService.decreaseWithOwnerWithdraw(em, withdrawEntry);
      });

      // ??????db???????????????????????? ????????????queue
      await this.web3Service.pushToTradeQueue({
        txnHash,
        signedTransaction,
        rawData,
        walletAddress,
      });

      return res.json({ ok: true });
    } catch (err) {
      return next(new HttpException({ msg: err.message, code: 'SD000036' }));
    }
  };

  private getCurrency = async (currency: string): Promise<Currency> => {
    const currencies = await Currency.find();
    const currencyEntity = currencies.find(c => c.name === currency);
    if (!currencyEntity) {
      throw new HttpException({ msg: 'This currency is not supported', code: 'SD000035' });
    }
    return currencyEntity;
  };
}

export default TradeController;
