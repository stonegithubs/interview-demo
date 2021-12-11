import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { isObjEmpty } from '../lib/utils';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';
import { IEntryCriteria } from './types';

export const setOptions = (criteria: IEntryCriteria): Record<string, any> => {
  const {
    id,
    currencyId,
    isProcess,
    isCompleted,
    isFailed,
    isConfirmed,
    merchantId,
    cryptoAmount,
    txnHash,
    createdAtStart,
    createdAtEnd,
    confirmedAtStart,
    confirmedAtEnd,
    completedAtStart,
    completedAtEnd,
    fromAddress,
    toAddress,
    firstResult,
    maxResults,
  } = criteria;

  const createdAt = setDate('createdAt', createdAtStart, createdAtEnd);
  const confirmAt = setDate('confirmAt', confirmedAtStart, confirmedAtEnd);
  const completedAt = setDate('completedAt', completedAtStart, completedAtEnd);

  return {
    where: {
      ...(id && { id: id }),
      ...(currencyId && { currencyId }),
      ...(isProcess != undefined && { isProcess }),
      ...(isCompleted != undefined && { isCompleted }),
      ...(isFailed != undefined && { isFailed }),
      ...(isConfirmed != undefined && { isConfirmed }),
      ...(merchantId != undefined && { merchantId }),
      ...(txnHash != undefined && { txnHash }),
      ...(fromAddress != undefined && { fromAddress }),
      ...(toAddress != undefined && { toAddress }),
      ...(cryptoAmount != undefined && { cryptoAmount }),
      ...(!isObjEmpty(createdAt) && createdAt),
      ...(!isObjEmpty(confirmAt) && confirmAt),
      ...(!isObjEmpty(completedAt) && completedAt),
    },
    ...(firstResult && { skip: firstResult }),
    ...(maxResults && { take: maxResults }),
    order: {
      createdAt: 'DESC',
    },
  };
};

export const setDate = (field: string, dateStart?: string, dateEnd?: string): Record<string, any> => {
  if (dateStart && dateEnd) {
    return {
      [field]: Between(dayjs(dateStart).format('YYYYMMDDHHmmss'), dayjs(dateEnd).format('YYYYMMDDHHmmss')),
    };
  }
  if (dateStart) {
    return { [field]: MoreThanOrEqual(dayjs(dateStart).format('YYYYMMDDHHmmss')) };
  }
  if (dateEnd) {
    return { [field]: LessThanOrEqual(dayjs(dateEnd).format('YYYYMMDDHHmmss')) };
  }
  return {};
};
