import { MyAxios } from '@/lib/my.axios';
import { EntryListType, EntryType } from '@/pages/entry/data';

export class EntryService {
  static getList = async (params?: any): Promise<EntryListType> => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/entry/list',
      params,
    }).then(res => res.ret);
  };

  static getOne = async (id: number | string): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'get',
      url: `/api/entry/${id}`,
    }).then(res => res.ret);
  };

  static confirm = async ({
    id,
    fromAddress,
    txnHash,
  }: { id: string | number, fromAddress: string, txnHash: string }): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'put',
      url: `/api/entry/${id}/manual_confirm`,
      data: {
        id,
        fromAddress,
        txnHash,
      },
    }).then(res => res.ret);
  };

  static callback = async (id: string | number): Promise<EntryType> => {
    return await MyAxios.http({
      method: 'put',
      url: `/api/entry/${id}/manual_callback`,
    }).then(res => res.ret);
  };
}
