import UserController from '../controller/user.controller';
import Route from './routes';
import { UserBasicRequest } from '../request/user.basic.request';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { OtpMiddleware } from '../middleware/otp.middleware';

class UserRoute extends Route {
  private userController = new UserController();

  constructor() {
    super();
    this.prefix = '/user';
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.router.post('', AuthMiddleware, UserBasicRequest, this.userController.register);
    this.router.post('/login', UserBasicRequest, OtpMiddleware, this.userController.login);
    this.router.get('/logout', AuthMiddleware, this.userController.logout);
    this.router.get('/isLogin', AuthMiddleware, this.userController.isLogin);
  }
}

export default UserRoute;
