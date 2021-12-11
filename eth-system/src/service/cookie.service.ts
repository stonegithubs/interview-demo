import MyRedis from '../lib/my.redis';
import { randStr } from '../lib/utils';

class CookieService {
  private redisClient: MyRedis;

  constructor() {
    this.redisClient = new MyRedis();
  }

  createLoginCookie = async (token:string): Promise<string> => {
    const key = randStr({ length: 36 });
    await this.redisClient.setKeyWithEx(key, token, 50000);
    return key;
  };
}

export default CookieService;
