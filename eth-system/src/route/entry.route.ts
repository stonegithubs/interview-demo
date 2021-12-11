import Route from './routes';
import { AuthMiddleware } from '../middleware/auth.middleware';
import EntryController from '../controller/entry.controller';
import { EntryListRequest } from '../request/entry.list.request';
import { EntryManualConfirmRequest } from '../request/entry.manual.confirm.request';

class EntryRoute extends Route {
  private entryController = new EntryController();

  constructor() {
    super();
    this.prefix = '/entry';
    this.router.use(AuthMiddleware);
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/list', EntryListRequest, this.entryController.list);
    this.router.get('/:entryId(\\d{18})', this.entryController.getOne);
    this.router.put('/:entryId(\\d{18})/manual_confirm', EntryManualConfirmRequest, this.entryController.manualConfirm);
    this.router.put('/:entryId(\\d{18})/manual_callback', this.entryController.manualCallback);
  }
}

export default EntryRoute;
