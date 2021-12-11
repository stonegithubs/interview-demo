export interface MerchantType {
  id: number;
  number: string;
  userId: number;
  minPerDeposit: string;
  maxPerDeposit: string;
  minPerWithdraw: string;
  maxPerWithdraw: string;
  feePercent: number;
  withdrawFeePercent: number;
}
