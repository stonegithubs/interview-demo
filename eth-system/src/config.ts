import * as dotenv from 'dotenv';

// prod環境變數寫在aws裡面
if (process.env.NODE_ENV !== 'prod') {
  dotenv.config({ path: __dirname + '/.env' });
}

const config: {
  BULL_BOARD_PORT: string,
  REDIS_DSN: string,
  INFURA_HTTPS: string,
  INFURA_WSS: string,
  ETHERSCAN_HTTPS: string,
  USDT_ADDRESS: string,
  MACHINE_ID: number,
  WEB_URL: string,
  ETHERSCAN_API_KEY: string;
  BLOCK_CONFIRMATION: number;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHANNEL_ID: string;
  JWT_SECRET_KEY: string;
  ETH_NETWORK: string;
  ALCHEMY_AUTH_TOKEN:string;
} = {
  BULL_BOARD_PORT: process.env.BULL_BOARD_PORT || '5001',
  REDIS_DSN: process.env.REDIS_DSN || 'redis://127.0.0.1:6379',
  INFURA_HTTPS: process.env.INFURA_HTTPS,
  INFURA_WSS: process.env.INFURA_WSS,
  ETHERSCAN_HTTPS: process.env.ETHERSCAN_HTTPS,
  USDT_ADDRESS: process.env.USDT_CONTRACT_ADDRESS,
  MACHINE_ID: process.env.MACHINE_ID as unknown as number,
  WEB_URL: process.env.WEB_URL,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  BLOCK_CONFIRMATION: process.env.BLOCK_CONFIRMATION as unknown as number,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  ETH_NETWORK: process.env.ETH_NETWORK,
  ALCHEMY_AUTH_TOKEN: process.env.ALCHEMY_AUTH_TOKEN,
};
export default config;
