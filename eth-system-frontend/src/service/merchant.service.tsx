import { MyAxios } from '@/lib/my.axios';
import { MerchantType } from '@/pages/merchant/data';

export class MerchantService {
  static getList = async (params: any) => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/merchant/list',
      data: {},
    }).then(res => res.ret);
  };

  static getOne = async (id: number): Promise<MerchantType> => {
    return await MyAxios.http({
      method: 'get',
      url: `/api/merchant/${id}`,
    }).then(res => res.ret);
  };

  static edit = async (id: number, params: MerchantType): Promise<MerchantType> => {
    return await MyAxios.http({
      method: 'put',
      url: `/api/merchant/${id}`,
      data: params,
    }).then(res => res.ret);
  };
}
