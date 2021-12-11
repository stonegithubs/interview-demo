import { Role } from '../entity/Role';
import { Privilege } from '../entity/Privilege';

export interface IEntryCriteria {
  id?: string;
  currencyId?: number;
  amount?: string;
  cryptoAmount?: string;
  merchantId?: string;
  txnHash?: string;
  isProcess?: boolean;
  isFailed?: boolean;
  isConfirmed?: boolean;
  isCompleted?: boolean;
  createdAtStart?: string;
  createdAtEnd?: string;
  confirmedAtStart?: string;
  confirmedAtEnd?: string;
  completedAtStart?: string;
  completedAtEnd?: string;
  fromAddress?: string;
  toAddress?: string;
  cbUrl?: string;
  firstResult?: number;
  maxResults?: number;
  relations?: string[];
}

export interface IRoleHasPrivilege extends Role {
  privilege: Privilege[];
}
