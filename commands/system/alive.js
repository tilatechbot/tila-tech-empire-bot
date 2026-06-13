import { formatTime } from '../../lib/utils.js';
import { config } from '../../config.js';

export default {
  name: 'alive',
  description: 'Check if bot is alive',
  usage: '.alive',
  
  execute: async (sock, msg, args) => {
    const uptime = formatTime(process.uptime() * 1000);
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🤖 *${config.botName}* is alive!\n\n` +
             `⏱️ Uptime: ${uptime}\n` +
             `📱 Status: Connected\n` +
             `🔧 Version: ${config.botVersion}`,
    });
  },
};
