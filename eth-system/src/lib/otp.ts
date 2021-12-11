import qrcode from 'qrcode';
import { authenticator } from '@otplib/preset-default';

const service = 'eth-system';

const generateOTPSecret = (): string => {
  return authenticator.generateSecret(32);
};

const generateOTPURL = async (user: string, secret: string) => {
  const otpauth = authenticator.keyuri(user, service, secret);
  return await qrcode.toDataURL(otpauth);
};

const validOTP = (token: string, secret: string): boolean => {
  return authenticator.check(token, secret);
};

export {
  generateOTPSecret,
  generateOTPURL,
  validOTP,
};
