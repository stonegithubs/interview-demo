import Ethereum from '../lib/web3';
import { Transaction, TransactionReceipt } from 'web3-core';
import MainContractAbi from '../contract/main.contract.abi.json';
import numeral from 'numeral';
import config from '../config';
import { Wallet } from '../entity/Wallet';
import { AbiItem } from 'web3-utils';
import { GasPrice } from '../entity/GasPrice';
import TradeQueue from '../queue/trade.queue';

export interface ITransferUSDTData {
  fromAddress: string;
  toAddress: string;
  amount: string;
  nonce?: number;
  gasPrice?: number;
}

export interface IRawData {
  contractAddress: string;
  gasLimit: number;
  nonce: number;
  toAddress: string;
  amount: string;
  gasPrice: number;
}

export interface IPushToTradeQueue {
  txnHash: string;
  signedTransaction: string;
  rawData: IRawData;
  walletAddress: string;
}

export interface IGetTransferUSDTRet {
  txnHash: string;
  gasPrice: number;
  signedTransaction: string;
  rawData: IRawData;
  walletAddress: string;
}

class Web3Service {
  ethereum: Ethereum;

  constructor() {
    this.ethereum = new Ethereum();
  }

  getTransaction = async (hash: string): Promise<Transaction> => {
    return await this.ethereum.getTransaction(hash);
  };

  getReceipt = async (hash: string): Promise<TransactionReceipt> => {
    return await this.ethereum.getTransactionReceipt(hash);
  };

  /**
   * 取得對鏈交易資料
   * @param {ITransferUSDTData} data
   * @returns {Promise<IGetTransferUSDTRet>}
   */
  getTransferUSDTData = async (data: ITransferUSDTData): Promise<IGetTransferUSDTRet> => {
    const { fromAddress, toAddress, amount } = data;

    let { nonce, gasPrice } = data;
    const contractAddr = fromAddress;
    const args = [
      config.USDT_ADDRESS, // USDT合約地址
      toAddress, // 打到哪個地址
      numeral(amount).value() * Math.pow(10, 6), // 金額
    ];

    const wallet = await Wallet.findOne(1);
    const gasLimit = await this.ethereum.getEstimateGas({
      contractAbi: MainContractAbi as AbiItem[],
      contractAddr: contractAddr,
      fnName: 'transferERC20',
      fromAddr: wallet.address,
      args,
    });

    if (!gasPrice) {
      gasPrice = (await GasPrice.findOne(1)).price;
    }
    // todo 如果gas price超過某個值就不交易

    if (!nonce) {
      nonce = await this.ethereum.getAddressNonce(wallet.address);
    }

    const rawTxnData = {
      contractAddress: fromAddress,
      gasLimit,
      nonce,
      privateKey: wallet.privateKey,
      toAddress,
      amount,
      gasPrice: gasPrice,
    };
    const { privateKey: _, ...withoutPrivateKey } = rawTxnData;
    const signedTransaction = await this.ethereum.signTransaction(rawTxnData);
    const txnHash = this.ethereum.shaSignedTransaction(signedTransaction);
    return { txnHash, gasPrice, signedTransaction, rawData: withoutPrivateKey, walletAddress: wallet.address };
  };

  /**
   * 推進交易queue
   * @param {string} txnHash
   * @param {string} signedTransaction
   * @param {IRawData} rawData
   * @param {string} walletAddress
   * @returns {Promise<void>}
   */
  pushToTradeQueue = async ({
    txnHash,
    signedTransaction,
    rawData,
    walletAddress,
  }: IPushToTradeQueue): Promise<void> => {
    TradeQueue.add(TradeQueue.name, { txnHash, signedTransaction, rawData });

    // 增加redis錢包nonce
    await this.ethereum.incrAddressNonce(walletAddress);
  };

}

export default Web3Service;
