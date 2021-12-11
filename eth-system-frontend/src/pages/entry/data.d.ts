export interface CurrencyType {
  id: number;
  name: string;
}

export interface EntryType {
  id: string;
  currencyId: number;
  rate: string;
  fee: string;
  amount: string;
  cryptoAmount: string;
  realCryptoAmount?: any;
  randomAmount: string;
  merchantId: number;
  txnHash: string;
  isProcess: boolean;
  isFailed: boolean;
  isConfirmed: boolean;
  isCompleted: boolean;
  createdAt: string;
  confirmedAt: string;
  completedAt: string;
  fromAddress: string;
  toAddress: string;
  cbUrl: string;
  cbId: string;
  currency: CurrencyType;
}

export interface EntryListType {
  entries: EntryType[];
  firstResult: number;
  maxResults: number;
  total: number;
}
