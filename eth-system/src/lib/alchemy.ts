import * as crypto from 'crypto';
import config from '../config';

/**
 * 驗證通知是不是alchemy傳來的
 * @param {string} body request body 要JSON.stringify
 * @param {string} signature request header的x-alchemy-signature
 * @returns {boolean}
 */
function isValidSignature(body: string, signature: string): boolean {
  const token = config.ALCHEMY_AUTH_TOKEN;
  const hmac = crypto.createHmac('sha256', token); // Create a HMAC SHA256 hash using the auth token
  hmac.update(body, 'utf8'); // Update the token hash with the request body using utf8
  const digest = hmac.digest('hex');

  return (signature === digest); // If signature equals your computed hash, return true
}

export {
  isValidSignature,
};
