import Route from './routes';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { EntryListRequest } from '../request/entry.list.request';
import WithdrawEntryController from '../controller/withdraw.entry.controller';
import { WithdrawEntryManualConfirmRequest } from '../request/withdraw.entry.manual.confirm.request';

class WithdrawEntryRoute extends Route {
  private withdrawEntryController = new WithdrawEntryController();

  constructor() {
    super();
    this.prefix = '/withdrawEntry';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/list', EntryListRequest, this.withdrawEntryController.list);
    this.router.get('/:entryId(\\d{18})', this.withdrawEntryController.getOne);
    this.router.put('/:entryId(\\d{18})/manual_confirm', WithdrawEntryManualConfirmRequest, this.withdrawEntryController.manualConfirm);
    this.router.put('/:entryId(\\d{18})/manual_callback', this.withdrawEntryController.manualCallback);
  }
}

export default WithdrawEntryRoute;
