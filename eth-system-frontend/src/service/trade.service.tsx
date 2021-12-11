import { MyAxios } from '@/lib/my.axios';
import { OwnerWithdrawType } from '@/pages/owner.withdraw.entry/data';

export class TradeService {
  static ownerWithdraw = async (params: OwnerWithdrawType): Promise<boolean> => {
    return await MyAxios.http({
      method: 'post',
      url: `/api/trade/ownerWithdraw`,
      data: params,
    }).then(res => res.ret)
  };
}
