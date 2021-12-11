import { MyAxios } from '@/lib/my.axios';
import { EntryListType, EntryType } from '@/pages/owner.withdraw.entry/data';

export class OwnerWithdrawEntryService {
  static getList = async (params?: any): Promise<EntryListType> => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/ownerWithdrawEntry/list',
      params,
    }).then(res => res.ret);
  };

  static getOne = async (id: number | string): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'get',
      url: `/api/ownerWithdrawEntry/${id}`,
    }).then(res => res.ret);
  };

  static confirm = async ({
    id,
    txnHash,
  }: { id: string | number, txnHash: string }): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'put',
      url: `/api/ownerWithdrawEntry/${id}/manual_confirm`,
      data: { txnHash },
    }).then(res => res.ret);
  };
}
