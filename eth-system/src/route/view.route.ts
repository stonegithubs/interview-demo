import ViewController from '../controller/view.controller';
import Route from './routes';

class ViewRoute extends Route {
  private viewController = new ViewController();

  constructor() {
    super();
    this.prefix = '/entry';
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/:entryId([0-9]{18})', this.viewController.entryIndex);
  }
}

export default ViewRoute;
