import redis, { RedisClient } from 'redis';
import config from '../config';

class MyRedis {
  redis: RedisClient;

  constructor() {
    this.redis = redis.createClient({ url: config.REDIS_DSN });
  }

  ping = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.redis.ping((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  };

  isKeyExists = (key: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.redis.exists(key, (err, isExists) => {
        if (err) reject(err);
        resolve(Boolean(isExists));
      });
    });
  };

  setKey = (key: string, data: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.redis.set(key, data, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  };

  setKeyWithEx = (key: string, data: string, duration: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.redis.set(key, data, 'EX', duration, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  };

  getKey = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.redis.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  };

  addressIncr = async (address: string): Promise<number> => {
    return new Promise((resolve, rejects) => {
      this.redis.incr(address, (err, data) => {
        if (err) rejects(err);
        resolve(data);
      });
    });
  };
}

export default MyRedis;
