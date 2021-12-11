import TradeController from '../controller/trade.controller';
import Route from './routes';
import { TradeBasicRequest } from '../request/trade.basic.request';
import { TradeWithdrawRequest } from '../request/trade.withdraw.request';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ManualTransferUsdtRequest } from '../request/manual.transfer.usdt.request';
import { OwnerWithdrawRequest } from '../request/owner.withdraw.request';

class TradeRoute extends Route {
  private tradeController = new TradeController();

  constructor() {
    super();
    this.prefix = '/trade';
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.post('/deposit', TradeBasicRequest, this.tradeController.deposit);
    this.router.post('/withdraw', TradeBasicRequest, TradeWithdrawRequest, this.tradeController.withdraw);
    this.router.post('/manualTransferUsdt', AuthMiddleware, ManualTransferUsdtRequest, this.tradeController.manualTransferUSDT);
    this.router.post('/ownerWithdraw', AuthMiddleware, OwnerWithdrawRequest, this.tradeController.ownerWithdraw);
  }
}

export default TradeRoute;
