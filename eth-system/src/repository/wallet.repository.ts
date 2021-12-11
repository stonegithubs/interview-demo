import { EntityRepository, Repository } from 'typeorm';
import { Wallet } from '../entity/Wallet';

@EntityRepository(Wallet)
class WalletRepository extends Repository<Wallet> {
}

export default WalletRepository;
