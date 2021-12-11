import { Response } from 'express';

export interface IMyResponse extends Response {
  __body_response: string;
}
