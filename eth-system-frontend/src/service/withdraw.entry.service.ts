import { MyAxios } from '@/lib/my.axios';
import { EntryListType, EntryType } from '@/pages/withdraw.entry/data';

export class WithdrawEntryService {
  static getList = async (params?: any): Promise<EntryListType> => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/withdrawEntry/list',
      params,
    }).then(res => res.ret);
  };

  static getOne = async (id: number | string): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'get',
      url: `/api/withdrawEntry/${id}`,
    }).then(res => res.ret);
  };

  static confirm = async ({
    id,
    txnHash,
  }: { id: string | number, txnHash: string }): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'put',
      url: `/api/withdrawEntry/${id}/manual_confirm`,
      data: { txnHash },
    }).then(res => res.ret);
  };

  static callback = async (id: string | number): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'put',
      url: `/api/withdrawEntry/${id}/manual_callback`,
    }).then(res => res.ret);
  };
}
