import Route from './routes';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { EntryListRequest } from '../request/entry.list.request';
import OwnerWithdrawEntryController from '../controller/owner.withdraw.entry.controller';
import { WithdrawEntryManualConfirmRequest } from '../request/withdraw.entry.manual.confirm.request';

class OwnerWithdrawEntryRoute extends Route {
  private ownerWithdrawEntryController = new OwnerWithdrawEntryController();

  constructor() {
    super();
    this.prefix = '/ownerWithdrawEntry';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/list', EntryListRequest, this.ownerWithdrawEntryController.list);
    this.router.get('/:entryId(\\d)', this.ownerWithdrawEntryController.getOne);
    this.router.put('/:entryId(\\d)/manual_confirm', WithdrawEntryManualConfirmRequest, this.ownerWithdrawEntryController.manualConfirm);
  }
}

export default OwnerWithdrawEntryRoute;
