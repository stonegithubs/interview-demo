import Route from './routes';
import WalletController from '../controller/wallet.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { WalletResetNonceRequest } from '../request/wallet.reset.nonce.request';

class WalletRoute extends Route {
  private walletController = new WalletController();

  constructor() {
    super();
    this.prefix = '/wallet';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.post('', this.walletController.create);
    this.router.get('/nonce', this.walletController.getWalletNonce);
    this.router.put('/reset_nonce', WalletResetNonceRequest, this.walletController.resetNonce);
  }
}

export default WalletRoute;
