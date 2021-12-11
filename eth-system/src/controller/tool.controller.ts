import { NextFunction, Request, Response } from 'express';
import MyRedis from '../lib/my.redis';
import { getConnection } from 'typeorm';

class ToolController {
  healthCheck = async (req: Request, res: Response): Promise<Response> => {
    return res.json({ ok: true, result: true, version: '0.4.26' });
  };

  getCookie = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { eth_system_auth: eth_systemAuth } = req.signedCookies;
    res.json({ ok: true, cookie: eth_systemAuth });
    next();
  };

  ping = async (req: Request, res: Response): Promise<Response> => {
    const redisClient = new MyRedis();
    const redisHealth = await redisClient.ping();
    const conn = await getConnection();
    const mysqlHealth = await conn.query('select 1');
    return res.json({ ok: true, redisHealth, mysqlHealth });
  };
}

export default ToolController;
