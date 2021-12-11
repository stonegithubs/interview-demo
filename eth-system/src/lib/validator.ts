import numeral from 'numeral';

/**
 * 判斷regex是否合法
 * @param {string} str
 * @param {RegExp} pattern
 * @returns {boolean}
 */
const isValid = (str: string, pattern: RegExp = /^[a-zA-Z0-9]{6,36}$/): boolean => {
  return new RegExp(pattern).test(str);
};

const isHashValid = (hash: string): boolean => {
  return (/^(0x)[0-9a-fA-F]{64}$/i.test(hash));
};
const isEthAddressValid = (address: string): boolean => {
  return (/^(0x)[0-9a-fA-F]{40}$/i.test(address));
};

const isValidHttpUrl = (str: string): boolean => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

const isPercent = (n: string): boolean => {
  const floatRegex = /^[+-]?\d+(\.\d+)?$/;
  if (!isValid(n, floatRegex)) {
    return false;
  }
  const num = numeral(n).value();

  return !(num < 0 || num > 100);
};

const isBoolean = (d: string | number): boolean => {
  return (d == 1 || d == 0);
};

export {
  isValid,
  isValidHttpUrl,
  isEthAddressValid,
  isPercent,
  isHashValid,
  isBoolean,
};
