import { NextFunction, Request, Response } from 'express';
import Ethereum from '../lib/web3';
import WalletService from '../service/wallet.service';
import MyRedis from '../lib/my.redis';

class WalletController {
  ethereum: Ethereum;
  private walletService: WalletService;
  private redisClient: MyRedis;

  constructor() {
    this.ethereum = new Ethereum();
    this.walletService = new WalletService();
    this.redisClient = new MyRedis();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { address, privateKey } = this.ethereum.createAccount();
    res.json({ address, private_key: privateKey });
    next();
  };

  /**
   * @api {get} /wallet/nonce
   * @apiName get_wallet_redis_nonce
   * @apiGroup Wallet
   *
   * @apiSuccess {Boolean} ok 是否成功
   * @apiSuccess {Number} ret nonce
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": 24
   *  }
   */
  getWalletNonce = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const wallet = await this.walletService.getOne();

    let nonce: string | number = await this.redisClient.getKey(wallet.address);

    if (!nonce) {
      nonce = (await this.ethereum.getAddressTransactionCount(wallet.address));
      await this.redisClient.setKey(wallet.address, nonce.toString());
    }

    res.json({ ok: true, ret: nonce });
    next();
  };

  /**
   * @api {put} /wallet/reset_nonce
   * @apiName reset_wallet_redis_nonce
   * @apiGroup Wallet
   *
   * @apiSuccess {Boolean} ok 是否成功
   * @apiSuccess {Number} ret nonce
   * @apiSuccessExample Success
   *  {
   *    "ok": true,
   *    "ret": 24
   *  }
   */
  resetNonce = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    let { custom_nonce: customNonce } = req.body;

    const wallet = await this.walletService.getOne();

    if (!customNonce) {
      customNonce = await this.ethereum.getAddressTransactionCount(wallet.address);
    }

    await this.redisClient.setKey(wallet.address, customNonce.toString());

    res.json({ ok: true, ret: { address: wallet.address, nonce: customNonce } });
    next();
  };
}

export default WalletController;
