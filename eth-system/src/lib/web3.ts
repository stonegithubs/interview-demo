import Web3 from 'web3';
import config from '../config';
import { Transaction, TransactionReceipt } from 'web3-core';
import { AbiItem } from 'web3-utils';
import MyRedis from './my.redis';
import MainContractAbi from '../contract/main.contract.abi.json';
import { ethers } from 'ethers';

class Ethereum {
  public web3: Web3;
  private redisClient: MyRedis;

  constructor(node: string = 'infura') {
    switch (node) {
    case 'infura':
      this.web3 = new Web3(config.INFURA_HTTPS);
      break;
    case 'etherscan':
      this.web3 = new Web3(config.ETHERSCAN_HTTPS);
      break;
    default:
      this.web3 = new Web3(config.INFURA_HTTPS);
    }
    this.redisClient = new MyRedis();
  }

  isListening(): Promise<boolean> {
    return new Promise(resolve => {
      this.web3.eth.net.isListening().then(isListening => {
        resolve(isListening);
      }).catch(err => {
        throw err;
      });
    });
  }

  /**
   * 建立錢包地址
   * @returns {{address: string, privateKey: string}}
   */
  createAccount(): { address: string, privateKey: string } {
    const wallet = this.web3.eth.accounts.create();
    return { address: wallet.address, privateKey: wallet.privateKey.substr(2) };
  }

  /**
   * 取得鏈上該地址的交易次數
   * @param address
   * @returns {Promise<number>}
   */
  async getAddressTransactionCount(address: string): Promise<number> {
    return await this.web3.eth.getTransactionCount(address);
  }

  /**
   * 取得當前gas price
   * @return string wei
   * @example 97970000000 wei => 97.97 gwei
   */
  getGasPrice(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getGasPrice()
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * 取得使用合約函式需要花費的gas limit
   * @param contractAbi 合約abi
   * @param contractAddress 合約地址
   * @param fnName 要計算的函式名稱
   * @param fromAddr 從哪個地址呼叫這個合約函式
   * @param args 合約函式參數
   * @return number
   */
  getEstimateGas({ contractAbi, contractAddr, fnName, fromAddr, args }:
    { contractAbi: AbiItem[], contractAddr: string, fnName: string, fromAddr: string, args: any[] }): Promise<number> {
    const contract = new this.web3.eth.Contract(contractAbi, contractAddr);

    return new Promise((resolve, reject) => {
      contract.methods?.[fnName](...args)
        .estimateGas({ from: fromAddr })
        .then((gas: number) => {
          resolve(this.web3.utils.hexToNumber(gas));
        })
        .catch(reject);
    });
  }

  getTransaction(hash: string): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransaction(hash)
        .then(resolve)
        .catch(reject);
    });
  }

  getTransactionReceipt(hash: string): Promise<TransactionReceipt> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionReceipt(hash)
        .then(resolve)
        .catch(reject);
    });
  }

  // todo 改成寫interface 多個幣別可以使用
  // todo 寫一個參數的interface
  signTransaction = async ({
    contractAddress, // 合約地址
    toAddress,
    amount,
    gasLimit,
    gasPrice,
    nonce,
    privateKey,
  }: {
    contractAddress: string
    toAddress: string,
    amount: number | string,
    gasLimit: number,
    gasPrice: number,
    nonce: number,
    privateKey: string,
  }): Promise<string> => {
    const mainContract = new this.web3.eth.Contract(MainContractAbi as AbiItem[], contractAddress);
    const usdtAmount = Number(amount) * Math.pow(10, 6);

    const encoded = mainContract.methods.transferERC20(config.USDT_ADDRESS, toAddress, usdtAmount).encodeABI();
    const tx = {
      to: contractAddress, // 要互動的合約
      data: encoded,
      nonce: nonce,
      gasLimit: this.web3.utils.toHex(gasLimit),
      gasPrice: this.web3.utils.toHex(gasPrice * Math.pow(10, 9)),
      value: 0,
    };

    const signer = new ethers.Wallet(privateKey);
    return await signer.signTransaction(tx);
  };

  shaSignedTransaction = (signedTransaction: string): string => {
    return this.web3.utils.sha3(signedTransaction);
  };

  /**
   * 取得address nonce
   * @param {string} address
   * @returns {Promise<number>}
   */
  getAddressNonce = async (address: string): Promise<number> => {
    let nonce = await this.redisClient.getKey(address);

    if (!nonce) {
      nonce = (await this.getAddressTransactionCount(address)).toString();
      await this.redisClient.setKey(address, nonce);
    }

    return Number(nonce);
  };

  incrAddressNonce = async (address: string): Promise<number> => {
    return await this.redisClient.addressIncr(address);
  };

  resetAddressNonce = async (address: string): Promise<boolean> => {
    const nonce = (await this.getAddressTransactionCount(address)).toString();
    return await this.redisClient.setKey(address, nonce);
  };
}

export default Ethereum;
