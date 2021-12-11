import { MyAxios } from '@/lib/my.axios';

export type LoginParamsType = {
  username: string;
  password: string;
  otp: string;
};

export class AuthService {
  static login = async (loginParam: LoginParamsType) => {
    const { username, password, otp } = loginParam;
    return await MyAxios.http({
      method: 'post',
      url: '/api/user/login',
      data: {
        username,
        password,
        otp,
      },
    });
  };

  static isLogin = async () => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/user/isLogin',
    })
      .then(res => res)
      .catch(err => false);
  };

  static logout = async () => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/user/logout',
    })
      .then(res => res)
      .catch(err => false);
  };
}
