import { FindOneOptions, getCustomRepository } from 'typeorm';
import WalletRepository from '../repository/wallet.repository';
import { Wallet } from '../entity/Wallet';

class WalletService {
  getOne = async (id?: string | number, options?: FindOneOptions): Promise<Wallet> => {
    const walletRepository = getCustomRepository(WalletRepository);
    return await walletRepository.findOne(id, options);
  };
}

export default WalletService;
