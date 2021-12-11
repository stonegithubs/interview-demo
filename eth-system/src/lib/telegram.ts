import axios from 'axios';
import config from '../config';



export async function sendMsg(msg: string): Promise<void> {
  await axios({
    method: 'post',
    url: 'https://api.telegram.org/bot' + config.TELEGRAM_BOT_TOKEN + '/sendMessage',
    data: { chat_id: config.TELEGRAM_CHANNEL_ID, text: msg },
  });
}
