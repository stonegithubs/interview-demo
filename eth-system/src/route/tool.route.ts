import Route from './routes';
import ToolController from '../controller/tool.controller';

class ToolRoute extends Route {
  private toolController = new ToolController();

  constructor() {
    super();
    this.prefix = '/tool';
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.get('/healthcheck', this.toolController.healthCheck);
    this.router.get('/ping', this.toolController.ping);
  }
}

export default ToolRoute;
