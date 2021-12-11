import { UniqueID } from 'nodejs-snowflake';
import config from '../config';
import dayjs from 'dayjs';
import qrcode from 'qrcode';
import md5 from 'blueimp-md5';

const uid = new UniqueID({
  returnNumber: true,
  machineID: config.MACHINE_ID,
});

const randStr = ({ length = 10, hex = false }: { length: number, hex?: boolean }): string => {
  const result = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (hex) {
    characters = 'ABCDEFabcdef0123456789';
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
};

/**
 * 產生訂單號
 * @returns {bigint | string}
 */
const idGenerator = (): bigint | string => uid.getUniqueID();

/**
 * 取得訂單號的timestamp
 * @param {bigint | string} id
 * @returns {number}
 */
const getIdTimestamp = (id: bigint | string): number => uid.getTimestampFromID(id);

/**
 * 取得訂單號的machine id
 * @param {bigint | string} id
 * @returns {number}
 */
const getIdMachineId = (id: bigint | string): number => uid.getMachineIDFromID(id);

/**
 * 取得訂單號時間
 * @param {bigint | string} id
 * @param {string} format
 * @returns {string}
 */
const getIdDate = (id: bigint | string, format: string = null): string => {
  const timestamp = getIdTimestamp(id);
  return dayjs(timestamp).format(format);
};

const getQRcodeImage = async (url: string, option: qrcode.QRCodeToDataURLOptions = { width: 200, margin: 2 })
  : Promise<string> => {
  try {
    return await qrcode.toDataURL(url, option);
  } catch (err) {
    throw err;
  }
};

const sortObjKeys = (obj: Record<string, any>): Record<string, any> => {
  return Object.keys(obj).sort()
    .reduce((prev, curr) => {
      return { ...prev, [curr]: obj[curr] };
    }, {});
};

const objToMd5Sign = (obj: Record<string, any>): string => {
  return md5Sign(Object.entries(sortObjKeys(obj))
    .map(arr => arr[0] + '=' + arr[1])
    .join('&'));
};

const md5Sign = (str: string): string => {
  return md5(str);
};

const isObjEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

export {
  randStr,
  idGenerator,
  getIdTimestamp,
  getIdMachineId,
  getIdDate,
  getQRcodeImage,
  md5Sign,
  sortObjKeys,
  objToMd5Sign,
  isObjEmpty,
};
