import { MyAxios } from '@/lib/my.axios';
import { OwnerWithdrawConfigType } from '@/pages/owner.withdraw.entry/data';

export class OwnerWithdrawConfigService {
  static getOwnerWithdrawConfig = async (): Promise<OwnerWithdrawConfigType> => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/ownerWithdrawConfig',
    }).then(res => res.ret);
  };
}
