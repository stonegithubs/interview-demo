import http from 'http';
import { Request } from 'express';

export interface IUserInfo {
  id: number;
  username: string,
  roleId: number;
  iat: number;
  exp: number;
  privilege: number[];
}

export interface IReqWithRawBody extends http.IncomingMessage {
  rawBody: string;
}

// extends express Request
export interface IMyRequest extends Request {
  uuid: string;
  rawBody: string;
}
