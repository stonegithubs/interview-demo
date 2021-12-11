import Route from './routes';
import { AuthMiddleware } from '../middleware/auth.middleware';
import ContractCurrencyController from '../controller/contract.currency.controller';

class ContractCurrencyRoute extends Route {
  private contractCurrencyController = new ContractCurrencyController();

  constructor() {
    super();
    this.prefix = '/contractCurrency';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('', this.contractCurrencyController.getContractCurrency);
  }
}

export default ContractCurrencyRoute;
