import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import HttpException from '../exception/http.exception';
import { signToken } from '../lib/jwt';
import CookieService from '../service/cookie.service';
import { generateOTPSecret, generateOTPURL } from '../lib/otp';
import { In } from 'typeorm';
import AuthService from '../service/auth.service';

class UserController {
  private cookieService: CookieService;
  private authService: AuthService;

  constructor() {
    this.cookieService = new CookieService();
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { username, password, otp } = req.body;
    try {
      const u = await User.findOne({
        where: { username, roleId: In([1, 2]) },
        select: ['id', 'username', 'password', 'otpSecret', 'roleId'],
      });
      if (!u) {
        return next(new HttpException({ status: 404, msg: 'User not exists', code: 'SD000006' }));
      }
      if (!(await User.isPasswordMatch(password, u.password))) {
        return next(new HttpException({ status: 400, msg: 'Wrong password', code: 'SD000007' }));
      }
      if (!User.isOTPMatch(otp, u.otpSecret)) {
        return next(new HttpException({ status: 400, msg: 'Wrong OTP', code: 'SD000054' }));
      }

      const rolePrivilege = await this.authService.getRolePrivilege(u.roleId);
      const token = signToken({
        username: u.username,
        id: u.id,
        roleId: u.roleId,
        privilege: rolePrivilege.privilege.map(p => p.id),
      });

      const cookie = await this.cookieService.createLoginCookie(token);
      res.cookie('eth_system_auth', cookie, { path: '/', signed: true, maxAge: 8 * 60 * 60 * 1000 });
      res.json({ ok: true, ret: token });
      next();
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    res.clearCookie('eth_system_auth');
    res.json({ ok: true });
    next();
  };

  async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { username, password } = req.body;
    const exist = await User.findOne({ where: { username } });
    if (exist) {
      return next(new HttpException({ status: 400, msg: 'Username exists', code: 'SD000003' }));
    }
    const otpSecret = generateOTPSecret();
    const u = new User({ username, password, roleId: Role.NORMAL_USER, otpSecret });
    await u.save({ reload: true });

    const otpURL = await generateOTPURL(u.username, otpSecret);

    res.json({ ok: true, ret: { username: u.username, otpURL } });
    next();
  }

  async isLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    res.json({ ok: true });
    next();
  }
}

export default UserController;
