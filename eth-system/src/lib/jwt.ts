import jwt from 'jsonwebtoken';
import config from '../config';
import HttpException from '../exception/http.exception';

export interface ITokenData {
  id: number;
  username: string;
  roleId: number;
  iat?: number;
  exp?: number;
  privilege: number[];
}

export function signToken(data: ITokenData): string {
  return jwt.sign(data, config.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: '8h' });
}

export function decodeToken(token: string): ITokenData {
  try {
    return jwt.verify(token, config.JWT_SECRET_KEY) as ITokenData;
  } catch (err) {
    throw new HttpException({ msg: err.message, code: 'SD000038' });
  }
}
