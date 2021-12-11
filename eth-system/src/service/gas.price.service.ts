import { GasPrice } from '../entity/GasPrice';
import dayjs from 'dayjs';

class GasPriceService {
  uspsert = async (price: number): Promise<void> => {
    const gasPrice = new GasPrice();
    gasPrice.id = 1;
    gasPrice.price = price;
    gasPrice.createdAt = dayjs().format('YYYYMMDDHHmmss');
    await gasPrice.save();
  };
}

export default GasPriceService;
