export default {
  name: 'ping',
  description: 'Check bot response time',
  usage: '.ping',
  ownerOnly: false,
  groupOnly: false,
  dmOnly: false,
  
  execute: async (sock, msg, args) => {
    const start = Date.now();
    const response = await sock.sendMessage(msg.key.remoteJid, {
      text: '🏓 Pong! Measuring...',
    });
    const ping = Date.now() - start;
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🏓 Pong! (${ping}ms)`,
    });
  },
};
