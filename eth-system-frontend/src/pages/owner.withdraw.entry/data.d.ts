export interface CurrencyType {
  id: number;
  name: string;
}

export interface UserType {
  id: number;
  username: string;
  roleId?: number;
}

export interface EntryType {
  id: string;
  currencyId: number;
  fee: string;
  cryptoAmount: string;
  realCryptoAmount?: any;
  merchantId: number;
  txnHash: string;
  isProcess: boolean;
  isFailed: boolean;
  isConfirmed: boolean;
  isCompleted: boolean;
  isManual: boolean;
  createdAt: string;
  confirmedAt: string;
  completedAt: string;
  fromAddress: string;
  toAddress: string;
  currency: CurrencyType;
  user: UserType;
}

export interface EntryListType {
  entries: EntryType[];
  firstResult: number;
  maxResults: number;
  total: number;
}

export interface ContractCurrencyType {
  balance: number;
  contractAddress: string;
  currency: {
    name: string;
  };
  id: number;
}

export interface OwnerWithdrawConfigType {
  id: number;
  userId: number;
  isEnableFeePercent: boolean;
  isEnableFeeAmount: boolean;
  feePercent: number;
  feeAmount: string;
  createdAt: string;
  modifiedAt: string;
}

export interface OwnerWithdrawType {
  balance: string;
  cryptoAmount: string;
  toAddress: string;
  currencyId: number;
}
