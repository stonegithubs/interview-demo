import Route from './routes';
import MerchantController from '../controller/merchant.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { MerchantCreateRequest } from '../request/merchant.create.request';
import { MerchantEditRequest } from '../request/merchant.edit.request';

class MerchantRoute extends Route {
  private merchantController = new MerchantController();

  constructor() {
    super();
    this.prefix = '/merchant';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.post('', MerchantCreateRequest, this.merchantController.create);
    this.router.get('/list', this.merchantController.list);
    this.router.put('/:merchantId(\\d+)', MerchantEditRequest, this.merchantController.edit);
    this.router.get('/:merchantId(\\d+)', this.merchantController.getMerchant);
  }
}

export default MerchantRoute;
