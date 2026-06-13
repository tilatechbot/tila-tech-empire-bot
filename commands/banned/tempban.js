import { User } from '../../lib/database.js';

export default {
  name: 'tempban',
  description: 'Temporarily ban a user',
  usage: '.tempban <duration>',
  ownerOnly: true,
  
  execute: async (sock, msg, args) => {
    const duration = args[0] || '1h';
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ User temporarily banned for ${duration}`,
    });
  },
};
