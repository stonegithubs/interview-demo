import { NextFunction, Request, Response } from 'express';
import ContractCurrencyService from '../service/contract.currency.service';
import HttpException from '../exception/http.exception';

class ContractCurrencyController {
  private contractCurrencyService: ContractCurrencyService;

  constructor() {
    this.contractCurrencyService = new ContractCurrencyService();
  }

  getContractCurrency = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const contractCurrency = await this.contractCurrencyService.getContractCurrency();
    if (!contractCurrency) {
      return next(new HttpException({ status: 404, msg: 'ContractCurrency not found', code: 'SD000088' }));
    }

    res.json({
      ok: true,
      ret: {
        id: contractCurrency.id,
        contractAddress: contractCurrency.contractAddress,
        balance: contractCurrency.balance,
        currency: {
          name: contractCurrency.currency.name,
        },
      },
    });
    next();
  };
}

export default ContractCurrencyController;
