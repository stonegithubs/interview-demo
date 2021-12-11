import { MyAxios } from '@/lib/my.axios';

export class ContractCurrencyService {
  static getContractCurrency = async () => {
    return await MyAxios.http({
      method: 'get',
      url: '/api/contractCurrency',
    }).then(res => res.ret)
      .catch((err) => {
        return false;
      });
  };
}
