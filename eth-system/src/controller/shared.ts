import { Request } from 'express';
import { IEntryCriteria } from '../repository/types';

/**
 * 取得訂單list的criteria
 * @param {e.Request} req
 * @returns {IEntryCriteria}
 */
export function getEntryListCriteria(req: Request): IEntryCriteria {
  const {
    id,
    currencyId,
    merchantId,
    txnHash,
    isProcess,
    isFailed,
    isConfirmed,
    isCompleted,
    createdAtStart,
    createdAtEnd,
    confirmedAtStart,
    confirmedAtEnd,
    completedAtStart,
    completedAtEnd,
    fromAddress,
    toAddress,
    cbUrl,
    firstResult,
    maxResults,
  } = req.query;

  return {
    id: id as string,
    currencyId: currencyId ? Number(currencyId) : undefined,
    merchantId: merchantId ? merchantId as string : undefined,
    txnHash: txnHash as string,
    isProcess: isProcess ? Boolean(isProcess) : undefined,
    isFailed: isFailed ? Boolean(isFailed) : undefined,
    isConfirmed: isConfirmed ? Boolean(isConfirmed) : undefined,
    isCompleted: isCompleted ? Boolean(isCompleted) : undefined,
    createdAtStart: createdAtStart ? createdAtStart as string : undefined,
    createdAtEnd: createdAtEnd ? createdAtEnd as string : undefined,
    confirmedAtStart: confirmedAtStart ? confirmedAtStart as string : undefined,
    confirmedAtEnd: confirmedAtEnd ? confirmedAtEnd as string : undefined,
    completedAtStart: completedAtStart ? completedAtStart as string : undefined,
    completedAtEnd: completedAtEnd ? completedAtEnd as string : undefined,
    fromAddress: fromAddress ? fromAddress as string : undefined,
    toAddress: toAddress ? toAddress as string : undefined,
    cbUrl: cbUrl ? cbUrl as string : undefined,
    firstResult: firstResult ? Number(firstResult) : 0,
    maxResults: maxResults ? Number(maxResults) : 20,
  };
}
