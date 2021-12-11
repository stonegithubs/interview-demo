import Route from './routes';
import { AuthMiddleware } from '../middleware/auth.middleware';
import OwnerWithdrawConfigController from '../controller/owner.withdraw.config.controller';
import { OwnerWithdrawConfigRequest } from '../request/owner.withdraw.config.request';

class OwnerWithdrawConfigRoute extends Route {
  private ownerWithdrawConfigController = new OwnerWithdrawConfigController();

  constructor() {
    super();
    this.prefix = '/ownerWithdrawConfig';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('', this.ownerWithdrawConfigController.getOwnerWithdrawConfig);
    this.router.post('', OwnerWithdrawConfigRequest, this.ownerWithdrawConfigController.newOwnerWithdrawConfig);
    this.router.put('', OwnerWithdrawConfigRequest, this.ownerWithdrawConfigController.editOwnerWithdrawConfig);
  }
}

export default OwnerWithdrawConfigRoute;
