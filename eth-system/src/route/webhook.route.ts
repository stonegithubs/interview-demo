import WebhookController from '../controller/webhook.controller';
import Route from './routes';
import { AlchemyValidRequest } from '../request/alchemy.valid.request';

class WebhookRoute extends Route {
  private webhookController = new WebhookController();

  constructor() {
    super();
    this.prefix = '/webhook';
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.post('/alchemy', AlchemyValidRequest, this.webhookController.alchemyWebhook);
  }
}

export default WebhookRoute;
