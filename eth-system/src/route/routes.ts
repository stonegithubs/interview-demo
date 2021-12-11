import { Router } from 'express';

abstract class Route {
	protected router = Router();

	protected prefix = '/';

	protected abstract setRoutes(): void;

	public getRouter(): Router {
	  return this.router;
	}

	public getPrefix(): string {
	  return this.prefix;
	}
}

export default Route;
